"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import db from "../db/src/db";
import { commentVotes, postComments, postVotes, posts } from "../db/src/schema";
import { Vote } from "@/utils/posts";
import { and, eq, sql } from "drizzle-orm";

//posts
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

export async function singlePost(postId: string) {
  const post = await db
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
    .where(eq(posts.id, postId))
    .groupBy(posts.id);

  return post[0];
}

export async function allPosts() {
  return await db
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
    .then((results) => {
      return results.map((post) => ({
        ...post,
        votes: post.votes as Vote[],
      }));
    });
}
export async function infinitePosts(page: number) {
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

//votes
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
