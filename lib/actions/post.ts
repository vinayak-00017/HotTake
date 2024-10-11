"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import db from "../db/src/db";
import {
  commentVotes,
  postComments,
  postVotes,
  posts,
  users,
} from "../db/src/schema";
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
      user: {
        username: users.username,
        id: users.id,
        profilePic: users.profilePic,
        name: users.name,
      },
      createdAt: posts.createdAt,
      totalVotes: sql.raw(
        `( SELECT SUM(
          CASE 
            WHEN post_votes.type = 'UP' THEN 1 
            WHEN post_votes.type = 'DOWN' THEN -1 
            ELSE 0
          END
        ) 
        FROM post_votes
        WHERE post_votes."postId" = posts.id 
        ) AS totalVotes`
      ),
      commentCount: sql.raw(`( SELECT COUNT(post_comments.id)
          FROM post_comments
          WHERE post_comments."postId" = posts.id
        ) AS commentCount`),
    })
    .from(posts)
    .leftJoin(users, eq(posts.userId, users.id))
    .where(eq(posts.id, postId))
    .groupBy(posts.id, users.id, users.name, users.username, users.profilePic);

  const result = post[0];
  return {
    ...result,
    votes: Number(result.totalVotes),
    commentCount: Number(result.commentCount),
  };
}

export async function allPosts() {
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      createdAt: posts.createdAt,
      user: {
        id: users.id,
        name: users.name,
        username: users.username,
        profilePic: users.profilePic,
      },
      votes: sql.raw("ARRAY_AGG(post_votes.type)"),
      commentCount: sql.raw("COUNT(post_comments.id)"),
    })
    .from(posts)
    .leftJoin(postVotes, eq(posts.id, postVotes.postId))
    .leftJoin(postComments, eq(posts.id, postComments.postId))
    .leftJoin(users, eq(posts.userId, users.id))
    .groupBy(posts.id, users.id, users.name, users.username, users.profilePic)
    .then((results) => {
      console.log(results[0].commentCount);
      return results.map((post) => ({
        ...post,
        votes: post.votes as Vote[],
        commentCount: Number(post.commentCount),
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
