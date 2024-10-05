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
  userId,
}: {
  title: string;
  content: string;
  id: string;
  votes: any;
  userId: string;
}) => {
  const handleUp = () => {
    handleVote({ postId: id, type: Vote.UP });
  };
  const handleDown = () => {
    handleVote({ postId: id, type: Vote.DOWN });
  };
  return (
    <article className="w-[50vw] flex justify-center flex-col items-center m-2 p-4 transition-colors duration-300 hover:bg-gray-700 rounded-xl">
      <h5>poster</h5>
      <h2 className="font-bold  text-2xl my-2">{title}</h2>
      <p>{content}</p>
      <footer className="flex ">
        <div className="buttons mx-4">
          <Button
            onClick={handleUp}
            className="hover:bg-gray-800 transition-colors duration-200 rounded-full"
          >
            UP{" "}
          </Button>
          {calculateVotes(votes)}
          <Button
            onClick={handleDown}
            className="hover:bg-gray-800 transition-colors duration-200 rounded-full"
          >
            Down
          </Button>
        </div>
        <Button className="text-white buttons ">
          <CommentIcon />
        </Button>
      </footer>
    </article>
  );
};
export default Post;
