"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { allComments, handleCommentVotes } from "@/lib/actions/comment";
import { Vote } from "@/utils/posts";
import { buildCommentTree, Comment } from "@/utils/comments";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [parentId, setParentId] = useState(null);
  const [openReplyIds, setOpenReplyIds] = useState<string[]>([]);
  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await allComments(postId);
      if (fetchedComments) {
        const commentTree = buildCommentTree(fetchedComments);
        setComments(commentTree ?? []);
      }
    };
    fetchComments();
  }, [postId]);

  const handleUp = (id: string) => {
    handleCommentVotes({ commentId: id, type: Vote.UP });
  };
  const handleDown = (id: string) => {
    handleCommentVotes({ commentId: id, type: Vote.DOWN });
  };

  const handleClick = () => {
    setIsOpen(false);
  };
  return (
    <section className="w-1/2">
      {!isOpen && <div onClick={() => setIsOpen(true)}> Post a reply</div>}
      {isOpen && (
        <CommentInput
          setComments={setComments}
          postId={postId}
          parentId={parentId}
          handleClick={handleClick}
        />
      )}
      {comments.map((comment) => (
        <CommentItem
          setComments={setComments}
          key={comment.id}
          comment={comment}
          openReplyIds={openReplyIds}
          setOpenReplyIds={setOpenReplyIds}
        />
      ))}
    </section>
  );
};

export default Comments;
