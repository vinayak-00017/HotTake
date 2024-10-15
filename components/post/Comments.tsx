"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { allComments } from "@/lib/actions/comment";
import { buildCommentTree, Comment } from "@/utils/comments";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import Image from "next/image";

const Comments = ({ profilePic }: { profilePic: string | null }) => {
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

  const handleClick = () => {
    setIsOpen(false);
  };
  return (
    <section className="w-1/2">
      {!isOpen && (
        <div onClick={() => setIsOpen(true)} className="flex m-4 ">
          <Image
            src={profilePic || "/profilePic/redChili.webp"}
            alt="profilePic"
            width={48}
            height={48}
            className="w-6 h-6 rounded-full"
          />
          <span>Post a reply</span>
        </div>
      )}
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
