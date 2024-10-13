import classNames from "classnames";
import React from "react";
import PostFooter from "./PostFooter";
import { handleCommentVotes } from "@/lib/actions/comment";
import CommentInput from "./CommentInput";
import { Comment } from "@/utils/comments";
import { Vote } from "@/utils/posts";

const CommentItem = ({
  setComments,
  comment,
  openReplyIds,
  setOpenReplyIds,
}: {
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  comment: Comment;
  openReplyIds: string[];
  setOpenReplyIds: (ids: string[]) => void;
}) => {
  const handleReplyClick = () => {
    if (openReplyIds.includes(comment.id)) {
      setOpenReplyIds(openReplyIds.filter((id) => id !== comment.id));
    } else {
      setOpenReplyIds([...openReplyIds, comment.id]);
    }
  };
  return (
    <article
      key={comment.id}
      className={classNames("pb-4, mb-4", {
        "ml-5": comment.parentId,
        "ml-0": !comment.parentId,
      })}
    >
      <h5>poster</h5>
      <h3>{comment.content}</h3>
      <PostFooter
        handleDown={() =>
          handleCommentVotes({ commentId: comment.id, type: Vote.DOWN })
        }
        handleUp={() =>
          handleCommentVotes({ commentId: comment.id, type: Vote.UP })
        }
        id={comment.id}
        votes={comment.votes}
        handleClick={handleReplyClick}
        commentCount={null}
      ></PostFooter>
      {openReplyIds.includes(comment.id) && (
        <CommentInput
          setComments={setComments}
          handleClick={handleReplyClick}
          postId={comment.postId}
          parentId={comment.id}
        />
      )}
      {comment.children && comment.children.length > 0 && (
        <div>
          {comment.children.map((child) => (
            <CommentItem
              setComments={setComments}
              key={child.id}
              comment={child}
              openReplyIds={openReplyIds}
              setOpenReplyIds={setOpenReplyIds}
            />
          ))}
        </div>
      )}
    </article>
  );
};

export default CommentItem;
