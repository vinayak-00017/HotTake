"use client";

import React from "react";
import { Button } from "./ui/button";
import { allPosts, handleVote } from "@/lib/actions/post";
import { posts } from "@/lib/db/src/schema";
import { title } from "process";
import { Vote } from "@/utils/posts";

const Post = ({
  title,
  content,
  id,
}: {
  title: string;
  content: string;
  id: string;
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
        <Button onClick={handleUp}>UP</Button>
        <Button onClick={handleDown}>Down</Button>
      </footer>
    </article>
  );
};
export default Post;
