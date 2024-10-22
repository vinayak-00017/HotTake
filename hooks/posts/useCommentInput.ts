import { addComment } from "@/lib/actions/comment";
import { Comment } from "@/utils/comments";
import { useState, useRef, useEffect } from "react";

const useCommentInput = (
  postId: string,
  parentId: string | null,
  handleClick: () => void,
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>
) => {
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

  return {
    comment,
    setComment,
    textareaRef,
    handleSubmit,
  };
};

export default useCommentInput;
