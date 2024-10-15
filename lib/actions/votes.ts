"use server";

import { Vote } from "@/utils/posts";
import { and, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import db from "../db/src/db";
import { commentVotes, posts, postVotes } from "../db/src/schema";

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
  let flag = true;
  const existingVote = await db
    .select({ type: postVotes.type, voteId: postVotes.id })
    .from(postVotes)
    .where(
      and(eq(postVotes.userId, session.user.id), eq(postVotes.postId, postId))
    );

  if (existingVote[0]) {
    await db.delete(postVotes).where(eq(postVotes.id, existingVote[0].voteId));
    flag = false;
    if (existingVote[0].type !== type) {
      await db.insert(postVotes).values({
        postId: postId,
        userId: session.user.id,
        type: type,
      });
      flag = true;
    }
  } else {
    await db.insert(postVotes).values({
      postId: postId,
      userId: session.user.id,
      type: type,
    });
  }
  const voteCount = await db
    .select({
      totalVotes: sql.raw(
        `( SELECT COALESCE(SUM(
        CASE 
          WHEN post_votes.type = 'UP' THEN 1 
          WHEN post_votes.type = 'DOWN' THEN -1 
          ELSE 0
        END
      ), 0) 
      ) `
      ),
    })
    .from(postVotes)
    .where(eq(postVotes.postId, postId));
  const totalVotes = Number(voteCount[0]?.totalVotes) ?? 0;
  return { totalVotes, flag };
}

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
  let flag = true;
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
    flag = false;
    if (existingVote[0].type !== type) {
      await db.insert(commentVotes).values({
        commentId: commentId,
        userId: session.user.id,
        type: type,
      });
      flag = true;
    }
  } else {
    await db.insert(commentVotes).values({
      commentId: commentId,
      userId: session.user.id,
      type: type,
    });
  }
  const voteCount = await db
    .select({
      totalVotes: sql.raw(
        `( SELECT COALESCE(SUM(
        CASE 
          WHEN comment_votes.type = 'UP' THEN 1 
          WHEN comment_votes.type = 'DOWN' THEN -1 
          ELSE 0
        END
      ), 0) 
      ) `
      ),
    })
    .from(commentVotes)
    .where(eq(commentVotes.commentId, commentId));
  const totalVotes = Number(voteCount[0]?.totalVotes) ?? 0;
  return { totalVotes, flag };
}

export async function getVoteType(postId: string) {
  const session = await getServerSession(authOptions);
  if (session?.user || session.user?.id) {
    const voteType = await db
      .select({ type: postVotes.type })
      .from(postVotes)
      .where(
        and(eq(postVotes.userId, session.user.id), eq(postVotes.postId, postId))
      );

    if (
      voteType.length !== 0 &&
      (voteType[0].type === "UP" || voteType[0].type === "DOWN")
    ) {
      return voteType[0].type;
    }
  }

  return null;
}

export async function getCommentVoteType(commentId: string) {
  const session = await getServerSession(authOptions);
  if (session?.user || session.user?.id) {
    const voteType = await db
      .select({ type: commentVotes.type })
      .from(commentVotes)
      .where(
        and(
          eq(commentVotes.userId, session.user.id),
          eq(commentVotes.commentId, commentId)
        )
      );

    if (
      voteType.length !== 0 &&
      (voteType[0].type === "UP" || voteType[0].type === "DOWN")
    ) {
      return voteType[0].type;
    }
  }

  return null;
}
