"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import db from "../db/src/db";
import { posts } from "../db/src/schema";

export async function createPost({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  const userId = session.user.id;

  await db.insert(posts).values({
    title,
    content,
    userId,
  });

  return {
    message: "Post added",
  };
}

export async function allPosts() {
  const allPosts = await db.select().from(posts);
  return allPosts;
}
