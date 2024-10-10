"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import CommentInput from "./CommentInput";
import { allComments, handleCommentVotes } from "@/lib/actions/comment";
import PostFooter from "./PostFooter";
import { Vote } from "@/utils/posts";

interface Comment {
  id: string;
  postId: string;
  userId: string | null;
  parentId: string | null;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  votes: Vote[];
}

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [parentId, setParentId] = useState(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await allComments(postId);
      setComments(fetchedComments ?? []);
    };
    fetchComments();
  }, [postId]);

  const handleclick = () => {
    setIsOpen(true);
  };
  const handleUp = (id: string) => {
    handleCommentVotes({ commentId: id, type: Vote.UP });
  };
  const handleDown = (id: string) => {
    handleCommentVotes({ commentId: id, type: Vote.DOWN });
  };

  return (
    <section className="w-1/2">
      <CommentInput postId={postId} parentId={parentId} />
      {comments.map((comment) => (
        <article key={comment.id}>
          <h5>poster</h5>
          <h3>{comment.content}</h3>
          <PostFooter
            handleDown={handleDown}
            handleUp={handleUp}
            id={comment.id}
            votes={comment.votes}
            handleClick={handleclick}
          ></PostFooter>
          {isOpen && (
            <CommentInput postId={comment.postId} parentId={comment.id} />
          )}
        </article>
      ))}
    </section>
  );
};

export default Comments;
