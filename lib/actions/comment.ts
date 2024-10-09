"use server";

import { Vote } from "@/utils/posts";
import { and, eq } from "drizzle-orm";
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
      .select()
      .from(postComments)
      .where(eq(postComments.postId, id));
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
