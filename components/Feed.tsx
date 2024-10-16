"use client";

import { allPosts, infinitePosts } from "@/lib/actions/post";
import React, { useCallback, useEffect, useState } from "react";
import Post from "./post/Posts";
import { useInView } from "react-intersection-observer";
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

const Feed = () => {
  const [page, setPage] = useState<number>(0);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { ref, inView } = useInView();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const fetchedPosts: PostType[] = await infinitePosts(page);
    setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
    setPage((page) => page + 1);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (inView) {
      fetchPosts();
    }
  }, [inView, fetchPosts]);

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
      <div ref={ref}></div>
      <button onClick={fetchPosts}>load more</button>
    </div>
  );
};

export default Feed;
