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
