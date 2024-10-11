"use client";

import { useParams } from "next/navigation";
import classNames from "classnames";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import CommentInput from "./CommentInput";
import { allComments, handleCommentVotes } from "@/lib/actions/comment";
import PostFooter from "./PostFooter";
import { calculateVotes, Vote } from "@/utils/posts";
import { buildCommentTree, Comment } from "@/utils/comments";

// interface Comment {
//   id: string;
//   postId: string;
//   userId: string | null;
//   parentId: string | null;
//   content: string;
//   createdAt: Date | null;
//   updatedAt: Date | null;
//   votes: Vote[];
// }

const CommentItem = ({
  comment,
  openReplyIds,
  setOpenReplyIds,
}: {
  comment: Comment;
  openReplyIds: string[];
  setOpenReplyIds: (ids: string[]) => void;
}) => {
  const calculatedVotes = calculateVotes(comment.votes);
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
        <CommentInput postId={comment.postId} parentId={comment.id} />
      )}
      {comment.children && comment.children.length > 0 && (
        <div>
          {comment.children.map((child) => (
            <CommentItem
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

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [parentId, setParentId] = useState(null);
  const [openReplyIds, setOpenReplyIds] = useState<string[]>([]);
  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id;

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

  return (
    <section className="w-1/2">
      <CommentInput postId={postId} parentId={parentId} />
      {comments.map((comment) => (
        <CommentItem
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
