import { allPosts } from "@/lib/actions/post";
import React, { useCallback, useEffect, useState } from "react";
import Post from "./Posts";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/utils/Icons";
import { posts } from "@/lib/db/src/schema";
import { Button } from "./ui/button";
import { Vote } from "@/utils/posts";

export type PostType = {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date | null;
  votes: Vote[];
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
            userId={post.userId}
            key={post.id}
            title={post.title}
            content={post.content}
            id={post.id}
            votes={post.votes}
          ></Post>
        );
      })}
    </div>
  );
};

export default Feed;
