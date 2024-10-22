"use client";

import React from "react";
import { Button } from "../ui/button";
import { Comment } from "@/utils/comments";
import useCommentInput from "@/hooks/posts/useCommentInput";

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
  const { comment, setComment, textareaRef, handleSubmit } = useCommentInput(
    postId,
    parentId,
    handleClick,
    setComments
  );
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
