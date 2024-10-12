"use client";

import React from "react";
import { handleVote } from "@/lib/actions/post";
import { Vote } from "@/utils/posts";
import { useRouter } from "next/navigation";
import PostFooter from "./PostFooter";
import Image from "next/image";

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
  votes: number;
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
      <div className="flex justify-center items-center">
        <Image
          src={user?.profilePic || "/profilePic/redChili.webp"}
          alt="profile pic"
          width={30}
          height={30}
          className="rounded-full m-1"
        ></Image>
        <h5>{user?.username}</h5>
      </div>
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
