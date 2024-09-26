"use server";

import { eq } from "drizzle-orm";
import db from "../db/src/db";
import { users } from "../db/src/schema";

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
