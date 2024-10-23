"use server";

import { eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import db from "../db/src/db";
import { postComments, users } from "../db/src/schema";
import { Comment } from "@/utils/comments";

export async function allComments(id: string) {
  try {
    return await db
      .select({
        id: postComments.id,
        content: postComments.content,
        user: {
          id: users.id,
          name: users.name,
          username: users.username,
          profilePic: users.profilePic,
        },
        createdAt: postComments.createdAt,
        updatedAt: postComments.updatedAt,
        parentId: postComments.parentId,
        postId: postComments.postId,
        totalVotes: sql.raw(
          `( SELECT COALESCE(SUM(
            CASE 
              WHEN comment_votes.type = 'UP' THEN 1 
              WHEN comment_votes.type = 'DOWN' THEN -1 
              ELSE 0
            END
          ), 0) 
          FROM comment_votes
          WHERE comment_votes."commentId" = post_comments.id 
          ) AS totalVotes`
        ),
      })
      .from(postComments)
      .innerJoin(users, eq(postComments.userId, users.id))
      .where(eq(postComments.postId, id))
      .groupBy(
        postComments.id,
        users.id,
        users.name,
        users.username,
        users.profilePic
      )
      .then((results) => {
        return results.map((comment) => ({
          ...comment,
          votes: Number(comment.totalVotes),
        }));
      });
  } catch (err) {
    console.error(err);
  }
}

export async function singleComment(id: string) {
  try {
    const comment = await db
      .select({
        id: postComments.id,
        content: postComments.content,
        user: {
          id: users.id,
          name: users.name,
          username: users.username,
          profilePic: users.profilePic,
        },
        createdAt: postComments.createdAt,
        updatedAt: postComments.updatedAt,
        parentId: postComments.parentId,
        postId: postComments.postId,
        totalVotes: sql.raw(
          `( SELECT COALESCE(SUM(
            CASE 
              WHEN comment_votes.type = 'UP' THEN 1 
              WHEN comment_votes.type = 'DOWN' THEN -1 
              ELSE 0
            END
          ), 0) 
          FROM comment_votes
          WHERE comment_votes."commentId" = post_comments.id 
          ) AS totalVotes`
        ),
      })
      .from(postComments)
      .leftJoin(users, eq(postComments.userId, users.id))
      .where(eq(postComments.id, id))
      .groupBy(
        postComments.id,
        users.id,
        users.name,
        users.username,
        users.profilePic
      );

    if (!comment || comment.length === 0) {
      return null;
    }

    const result = comment[0];

    return {
      ...result,
      children: [],
      votes: Number(result.totalVotes),
    } as Comment;
  } catch (err) {
    console.error(err);
  }
}

export async function addComment({
  postId,
  content,
  parentId,
}: {
  postId: string;
  content: string;
  parentId: string | null;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !session.user?.id) {
      return {
        message: "Unauthenticated request",
      };
    }

    const userId = session.user.id;
    const newComment = {
      userId,
      parentId,
      content,
      postId,
    };
    const id = await db
      .insert(postComments)
      .values(newComment)
      .returning({ commentId: postComments.id });
    const result = singleComment(id[0].commentId);

    return result;
  } catch (err) {
    console.error(err);
  }
}

export async function infiniteComments(id: string, cursor: number) {
  try {
    return await db
      .select({
        id: postComments.id,
        content: postComments.content,
        user: {
          id: users.id,
          name: users.name,
          username: users.username,
          profilePic: users.profilePic,
        },
        createdAt: postComments.createdAt,
        updatedAt: postComments.updatedAt,
        parentId: postComments.parentId,
        postId: postComments.postId,
        totalVotes: sql.raw(
          `( SELECT COALESCE(SUM(
            CASE 
              WHEN comment_votes.type = 'UP' THEN 1 
              WHEN comment_votes.type = 'DOWN' THEN -1 
              ELSE 0
            END
          ), 0) 
          FROM comment_votes
          WHERE comment_votes."commentId" = post_comments.id 
          ) AS totalVotes`
        ),
      })
      .from(postComments)
      .innerJoin(users, eq(postComments.userId, users.id))
      .where(eq(postComments.postId, id))
      .groupBy(
        postComments.id,
        users.id,
        users.name,
        users.username,
        users.profilePic
      )
      .then((results) => {
        return results.map((comment) => ({
          ...comment,
          votes: Number(comment.totalVotes),
        }));
      });
  } catch (err) {
    console.error(err);
  }
}
