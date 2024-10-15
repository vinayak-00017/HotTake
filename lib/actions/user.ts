"use server";

import { eq } from "drizzle-orm";
import db from "../db/src/db";
import { users } from "../db/src/schema";
import { authOptions } from "../auth/authOptions";
import { getServerSession } from "next-auth";

export async function checkUsername(username: string) {
  try {
    const isUser = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.username, username));

    if (isUser[0]) {
      return true;
    }
  } catch (err) {
    console.error(err);
  }

  return false;
}

export async function userSignup({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    await db.insert(users).values({
      password: password,
      email: email,
      username: username,
    });
    console.log("Signup Complete");
  } catch (err) {
    console.error(err);
  }
}

export async function changeUsername(username: string, email: string) {
  try {
    await db
      .update(users)
      .set({ username: username })
      .where(eq(users.email, email));
  } catch (err) {
    console.error(err);
  }
}

export async function getUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
      return {
        message: "Unauthenticated request",
      };
    }

    const userId = session.user.id;

    const user = await db
      .select({
        username: users.username,
        profilePic: users.profilePic,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, userId));

    return user[0];
  } catch (err) {
    console.error(err);
  }
}

export async function getUsername(userId: string) {
  try {
    const username = await db
      .select({
        username: users.username,
      })
      .from(users)
      .where(eq(users.id, userId));
    return username[0].username;
  } catch (err) {
    console.error(err);
  }
}
