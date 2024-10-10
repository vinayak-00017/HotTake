"use client";

import React from "react";
import { Button } from "./ui/button";
import { handleVote } from "@/lib/actions/post";
import { Vote, calculateVotes } from "@/utils/posts";
import { CommentIcon } from "@/utils/Icons";
import { useRouter } from "next/navigation";
import PostFooter from "./PostFooter";

export const handleUp = (id: string) => {
  handleVote({ postId: id, type: Vote.UP });
};
export const handleDown = (id: string) => {
  handleVote({ postId: id, type: Vote.DOWN });
};

const Posts = ({
  title,
  content,
  id,
  votes,
  userId,
}: {
  title: string;
  content: string;
  id: string;
  votes: Vote[];
  userId: string;
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
      <h5>poster</h5>
      <h2 className="font-bold  text-2xl my-2">{title}</h2>
      <p>{content}</p>
      <PostFooter
        id={id}
        votes={votes}
        handleUp={handleUp}
        handleDown={handleDown}
        handleClick={handlePostClick}
      />
    </article>
  );
};
export default Posts;
