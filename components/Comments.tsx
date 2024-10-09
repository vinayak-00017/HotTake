"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import CommentInput from "./CommentInput";
import { allComments } from "@/lib/actions/comment";

interface Comment {
  id: string;
  postId: string | null;
  userId: string | null;
  parentId: string | null;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [parentId, setParentId] = useState(null);
  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await allComments(postId);
      setComments(fetchedComments ?? []);
    };
    fetchComments();
  }, [postId]);

  return (
    <section className="w-1/2">
      <CommentInput postId={postId} parentId={parentId} />
      {comments.map((comment) => (
        <article key={comment.id}>
          <h5>poster</h5>
          <h3>{comment.content}</h3>
          <footer></footer>
        </article>
      ))}
    </section>
  );
};

export default Comments;
