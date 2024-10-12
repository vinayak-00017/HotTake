"use server";

import { Vote } from "@/utils/posts";
import { and, count, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import db from "../db/src/db";
import { commentVotes, postComments } from "../db/src/schema";

export async function handleCommentVotes({
  commentId,
  type,
}: {
  commentId: string;
  type: Vote;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "unauthenticated request",
    };
  }
  const existingVote = await db
    .select({ type: commentVotes.type, voteId: commentVotes.id })
    .from(commentVotes)
    .where(
      and(
        eq(commentVotes.userId, session.user.id),
        eq(commentVotes.commentId, commentId)
      )
    );

  if (existingVote[0]) {
    await db
      .delete(commentVotes)
      .where(eq(commentVotes.id, existingVote[0].voteId));
    if (existingVote[0].type !== type) {
      await db.insert(commentVotes).values({
        commentId: commentId,
        userId: session.user.id,
        type: type,
      });
    }
  } else {
    await db.insert(commentVotes).values({
      commentId: commentId,
      userId: session.user.id,
      type: type,
    });
  }
}

export async function allComments(id: string) {
  try {
    return await db
      .select({
        id: postComments.id,
        content: postComments.content,
        userId: postComments.userId,
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
      .where(eq(postComments.postId, id))
      .groupBy(postComments.id)
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
    await db.insert(postComments).values({
      userId,
      parentId,
      content,
      postId,
    });

    return {
      message: "comment added succussfully",
    };
  } catch (err) {
    console.error(err);
  }
}
