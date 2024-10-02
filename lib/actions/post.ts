"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import db from "../db/src/db";
import { postVotes, posts } from "../db/src/schema";
import { Vote } from "@/utils/posts";
import { and, eq, sql } from "drizzle-orm";

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
  console.log(userId);

  await db.insert(posts).values({
    title,
    content,
    userId,
  });

  return {
    message: "Post added",
  };
}

export async function allPosts(page: number) {
  const offset = page * 5;
  const allPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      userId: posts.userId,
      createdAt: posts.createdAt,
      votes: sql.raw("ARRAY_AGG(post_votes.type)"),
    })
    .from(posts)
    .leftJoin(postVotes, eq(posts.id, postVotes.postId))
    .groupBy(posts.id)
    .limit(5)
    .offset(offset);
  return allPosts;
}

export async function handleVote({
  postId,
  type,
}: {
  postId: string;
  type: Vote;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "unauthenticated request",
    };
  }

  const existingVote = await db
    .select({ type: postVotes.type, voteId: postVotes.id })
    .from(postVotes)
    .where(
      and(eq(postVotes.userId, session.user.id), eq(postVotes.postId, postId))
    );

  if (existingVote[0]) {
    await db.delete(postVotes).where(eq(postVotes.id, existingVote[0].voteId));
    if (existingVote[0].type !== type) {
      await db.insert(postVotes).values({
        postId: postId,
        userId: session.user.id,
        type: type,
      });
    }
  } else {
    await db.insert(postVotes).values({
      postId: postId,
      userId: session.user.id,
      type: type,
    });
  }
}
