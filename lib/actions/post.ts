"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import db from "../db/src/db";
import { postTags, postVotes, posts, tags, users } from "../db/src/schema";
import { and, asc, eq, sql } from "drizzle-orm";

//posts
export async function createPost({
  title,
  content,
  inputTags,
}: {
  title: string;
  content: string;
  inputTags: string[];
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  const userId = session.user.id;

  const response = await db
    .insert(posts)
    .values({
      title,
      content,
      userId,
    })
    .returning({ postId: posts.id });

  const postId = response[0].postId;

  const formatedTags = inputTags.map((tag) => tag.toLowerCase());

  const tagIds = await Promise.all(
    formatedTags.map(async (tag) => {
      const existingTag = await db
        .select({ id: tags.id })
        .from(tags)
        .where(eq(tags.name, tag))
        .limit(1);

      if (existingTag.length > 0) {
        return existingTag[0].id;
      } else {
        const newTag = await db
          .insert(tags)
          .values({ name: tag })
          .returning({ id: tags.id });
        return newTag[0].id;
      }
    })
  );

  await db.insert(postTags).values(
    tagIds.map((tagId) => ({
      postId,
      tagId,
    }))
  );

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
export async function infinitePosts(cursor: number) {
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
    .offset(cursor)
    .then((results) => {
      return results.map((post) => ({
        ...post,
        votes: Number(post.totalVotes),
        commentCount: Number(post.commentCount),
      }));
    });
  const nextCursor = limitedPosts.length < 1 ? null : cursor + 5;

  return { data: limitedPosts, nextCursor: nextCursor };
}
