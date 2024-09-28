"use client";

import React from "react";
import { Button } from "./ui/button";
import { handleVote } from "@/lib/actions/post";
import { Vote, calculateVotes } from "@/utils/posts";
import { CommentIcon } from "@/utils/Icons";

const Post = ({
  title,
  content,
  id,
  votes,
}: {
  title: string;
  content: string;
  id: string;
  votes: any;
}) => {
  const handleUp = () => {
    handleVote({ postId: id, type: Vote.UP });
  };
  const handleDown = () => {
    handleVote({ postId: id, type: Vote.DOWN });
  };
  return (
    <article className="w-[50vw] flex justify-center flex-col items-center">
      <h5>poster</h5>
      <h2>{title}</h2>
      <p>{content}</p>
      <footer>
        <Button onClick={handleUp}>UP </Button>
        {calculateVotes(votes)}
        <Button onClick={handleDown}>Down</Button>
        <Button className="text-white">
          <CommentIcon />
        </Button>
      </footer>
    </article>
  );
};
export default Post;
