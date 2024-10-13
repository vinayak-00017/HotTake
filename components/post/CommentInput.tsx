"use client";

import React, { useEffect, useRef, useState } from "react";
import { addComment } from "@/lib/actions/comment";
import { Button } from "../ui/button";
import { Comment } from "@/utils/comments";

const CommentInput = ({
  postId,
  parentId,
  handleClick,
  setComments,
}: {
  postId: string;
  parentId: string | null;
  handleClick: () => void;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}) => {
  const [comment, setComment] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async () => {
    try {
      if (comment.trim()) {
        const newComment = await addComment({
          postId,
          content: comment,
          parentId,
        });

        console.log(newComment);

        if (!newComment || "message" in newComment) {
          console.error(newComment?.message || "Failed to add comment");
          return;
        }

        setComments((prevComments) => {
          const updatedComments = [...prevComments];
          if (parentId) {
            const insertComment = (comments: Comment[]): boolean => {
              for (const comment of comments) {
                if (comment.id === parentId) {
                  comment.children = comment.children || [];
                  comment.children.push(newComment);
                  return true;
                }
                if (comment.children && insertComment(comment.children)) {
                  return true;
                }
              }
              return false;
            };
            insertComment(updatedComments);
          } else {
            updatedComments.push(newComment);
          }
          return updatedComments;
        });
        setComment("");
        handleClick();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative w-full  border border-gray-300 p-2 m-2 rounded-2xl focus-within:border-red-500 ">
      <textarea
        ref={textareaRef}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full rounded-2xl  p-2 min-h-8 focus:outline-none bg-backgroundGray"
      />

      <div className="justify-end flex">
        <Button onClick={handleClick}>cancel </Button>
        <Button className="bg-orange-600 rounded-2xl" onClick={handleSubmit}>
          comment
        </Button>
      </div>
    </div>
  );
};

export default CommentInput;
