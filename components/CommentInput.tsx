import React, { useState } from "react";
import { Button } from "./ui/button";
import { addComment } from "@/lib/actions/comment";

const CommentInput = ({
  postId,
  parentId,
}: {
  postId: string;
  parentId: string | null;
}) => {
  const [comment, setComment] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      await addComment({ postId, content: comment, parentId });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      onClick={() => setIsOpen(true)}
      className="relative w-full  border border-gray-300 p-2 m-2 rounded-2xl focus-within:border-red-500 "
    >
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full rounded-2xl  p-2 min-h-8 focus:outline-none bg-backgroundGray"
      />
      {isOpen && (
        <div className="justify-end flex">
          <Button onClick={() => setIsOpen(false)}>cancel </Button>
          <Button className="bg-orange-600 rounded-2xl" onClick={handleSubmit}>
            comment
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentInput;
