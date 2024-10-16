import classNames from "classnames";
import React, { useState } from "react";
import CommentInput from "./CommentInput";
import { Comment } from "@/utils/comments";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CommentFooter from "./CommentFooter";
import { Minus, Plus } from "@/utils/Icons";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(true);

  const router = useRouter();
  const handleReplyClick = () => {
    if (openReplyIds.includes(comment.id)) {
      setOpenReplyIds(openReplyIds.filter((id) => id !== comment.id));
    } else {
      setOpenReplyIds([...openReplyIds, comment.id]);
    }
  };
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const toggleContent = () => setIsContentVisible(!isContentVisible);

  return (
    <article
      key={comment.id}
      className={classNames("pb-4, mb-8", {
        "ml-5": comment.parentId,
        "ml-0": !comment.parentId,
      })}
    >
      <div>
        <button onClick={toggleContent} className="mr-2 mt-1">
          {isContentVisible ? <Minus /> : <Plus />}
        </button>

        {isContentVisible ? (
          <div>
            <div
              className="flex my-2 cursor-pointer"
              onClick={() => router.push(`/profile/${comment.user.username}`)}
            >
              <Image
                src={comment.user.profilePic ?? "/profilePic/redChili.webp"}
                alt="profilePic"
                width={30}
                height={30}
                className="rounded-full"
              />
              <h6 className="mx-1">{comment.user.name}</h6>
              <h6>@{comment.user.username}</h6>
            </div>

            <h3>{comment.content}</h3>
            {/* <button onClick={toggleExpand} className="mr-2">
              {isExpanded ? <Minus /> : <Plus />}
            </button> */}
            <CommentFooter
              commentId={comment.id}
              votes={comment.votes}
              handleClick={handleReplyClick}
            ></CommentFooter>
          </div>
        ) : (
          <div>{!comment.parentId && <span>{comment.user.name}</span>}</div>
        )}
        {openReplyIds.includes(comment.id) && (
          <CommentInput
            setComments={setComments}
            handleClick={handleReplyClick}
            postId={comment.postId}
            parentId={comment.id}
          />
        )}
      </div>
      {isContentVisible &&
        isExpanded &&
        comment.children &&
        comment.children.length > 0 && (
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
