"use server";

import { eq } from "drizzle-orm";
import db from "../db/src/db";
import { users } from "../db/src/schema";
import { authOptions } from "../auth/authOptions";
import { getServerSession } from "next-auth";

//checks username availibility
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

//Check email availability
export async function checkEmailAvailability(email: string) {
  try {
    const isUser = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.email, email));
    console.log(isUser[0]);

    if (isUser[0] && isUser[0].id.length !== 0) {
      return false;
    }
  } catch (err) {
    console.error(err);
  }

  return true;
}

//changes the username during signup
export async function changeUsername(username: string) {
  try {
    const session = await getServerSession(authOptions);
    if (session.user && session.user.id) {
      await db
        .update(users)
        .set({ username: username })
        .where(eq(users.id, session.user.id));
    }
  } catch (err) {
    console.error(err);
  }
}

export async function getUser() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user && !session.user?.id) {
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
        id: users.id,
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
    const response = await db
      .select({
        username: users.username,
      })
      .from(users)
      .where(eq(users.id, userId));

    return response[0];
  } catch (err) {
    console.error(err);
  }
}

// returns user with a specific userId
export async function getProfileUser(username: string) {
  try {
    const response = await db
      .select({
        name: users.name,
        username: users.username,
        profilePic: users.profilePic,
        id: users.id,
      })
      .from(users)
      .where(eq(users.username, username));

    return response[0];
  } catch (err) {
    console.error(err);
  }
}
