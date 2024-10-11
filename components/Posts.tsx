"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { handleVote } from "@/lib/actions/post";
import { Vote, calculateVotes } from "@/utils/posts";
import { CommentIcon } from "@/utils/Icons";
import { useRouter } from "next/navigation";
import PostFooter from "./PostFooter";
import { getUser } from "@/lib/actions/user";

type userType = {
  profilePic: string | null;
  username: string;
  name: string | null;
};

export const handleUp = (id: string, event: React.MouseEvent) => {
  event.stopPropagation();
  handleVote({ postId: id, type: Vote.UP });
};
export const handleDown = (id: string, event: React.MouseEvent) => {
  event.stopPropagation();
  handleVote({ postId: id, type: Vote.DOWN });
};

const Posts = ({
  title,
  content,
  id,
  votes,
  user,
  commentCount,
}: {
  title: string;
  content: string;
  id: string;
  votes: Vote[];
  user: userType | null;
  commentCount: number;
}) => {
  const router = useRouter();

  const handlePostClick = () => {
    router.push(`post/${id}`);
  };

  return (
    <article
      onClick={handlePostClick}
      className="w-[50vw] flex justify-center flex-col items-center m-2 p-4 transition-colors duration-300 hover:bg-gray-700 rounded-xl cursor-pointer"
    >
      <h5>{user?.username}</h5>
      <h2 className="font-bold  text-2xl my-2">{title}</h2>
      <p>{content}</p>
      <PostFooter
        id={id}
        votes={votes}
        handleUp={handleUp}
        handleDown={handleDown}
        handleClick={handlePostClick}
        commentCount={commentCount}
      />
    </article>
  );
};
export default Posts;
