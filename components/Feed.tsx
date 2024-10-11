import { allPosts } from "@/lib/actions/post";
import React, { useCallback, useEffect, useState } from "react";
import Post from "./Posts";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/utils/Icons";
import { posts } from "@/lib/db/src/schema";
import { Button } from "./ui/button";
import { Vote } from "@/utils/posts";

export type UserType = {
  id: string;
  name: string | null;
  username: string;
  profilePic: string | null;
};
export type PostType = {
  id: string;
  title: string;
  content: string;
  createdAt: Date | null;
  votes: number;
  commentCount: number;
  user: UserType | null;
};
interface FeedProps {
  initialPosts: PostType[];
}

const Feed = async () => {
  const posts: PostType[] = await allPosts();

  return (
    <div>
      {posts.map((post) => {
        return (
          <Post
            user={post.user}
            key={post.id}
            title={post.title}
            content={post.content}
            id={post.id}
            votes={post.votes}
            commentCount={post.commentCount}
          ></Post>
        );
      })}
    </div>
  );
};

export default Feed;
