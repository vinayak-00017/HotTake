"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import db from "../db/src/db";
import { postVotes, posts, users } from "../db/src/schema";
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
      createdAt: posts.createdAt,
      user: {
        username: users.username,
        id: users.id,
        profilePic: users.profilePic,
        name: users.name,
      },
      totalVotes: sql.raw(
        `( SELECT COALESCE(SUM(
          CASE 
            WHEN post_votes.type = 'UP' THEN 1 
            WHEN post_votes.type = 'DOWN' THEN -1 
            ELSE 0
          END
        ), 0) 
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
      totalVotes: sql.raw(
        `( SELECT COALESCE(SUM(
          CASE 
            WHEN post_votes.type = 'UP' THEN 1 
            WHEN post_votes.type = 'DOWN' THEN -1 
            ELSE 0
          END
        ), 0) 
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
    .groupBy(posts.id, users.id, users.name, users.username, users.profilePic)
    .then((results) => {
      return results.map((post) => ({
        ...post,
        votes: Number(post.totalVotes),
        commentCount: Number(post.commentCount),
      }));
    });
}
export async function infinitePosts(page: number) {
  const offset = page * 5;
  const limitedPosts = await db
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
      totalVotes: sql.raw(
        `( SELECT COALESCE(SUM(
        CASE 
          WHEN post_votes.type = 'UP' THEN 1 
          WHEN post_votes.type = 'DOWN' THEN -1 
          ELSE 0
        END
      ), 0) 
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
    .groupBy(posts.id, users.id, users.name, users.username, users.profilePic)
    .limit(5)
    .offset(offset)
    .then((results) => {
      return results.map((post) => ({
        ...post,
        votes: Number(post.totalVotes),
        commentCount: Number(post.commentCount),
      }));
    });
  return limitedPosts;
}
