"use client";

import { allPosts } from "@/lib/actions/post";
import React, { useCallback, useEffect, useState } from "react";
import Post from "./Posts";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/utils/Icons";
import { posts } from "@/lib/db/src/schema";
import { Button } from "./ui/button";

type PostType = {
  id: string;
  title: string;
  content: string;
  userId: string | null;
  createdAt: Date | null;
  votes: unknown;
};
interface FeedProps {
  initialPosts: PostType[];
}

const Feed: React.FC<FeedProps> = ({ initialPosts }) => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<PostType[]>(initialPosts);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();

  // const fetchPosts = useCallback(async () => {
  //   if (loading) return;
  //   setLoading(true);
  //   const newPosts = await allPosts(page);
  //   setPosts((prevPosts) => [...prevPosts, ...newPosts]);
  //   setHasMore(newPosts.length > 0);
  //   setLoading(false);
  // }, [page]);

  // useEffect(() => {
  //   fetchPosts();
  // }, [fetchPosts]);

  // useEffect(() => {
  //   if (inView && hasMore) {
  //     setPage((prevPage) => prevPage + 1);
  //   }
  // }, [inView, hasMore, loading]);
  const loadPosts = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const newPosts = await allPosts(page);
    setPage((prevPage) => prevPage + 1);
    console.log(newPosts);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    setHasMore(newPosts.length > 0);
    setLoading(false);
  }, [loading, page]);

  // useEffect(() => {
  //   loadPosts();
  // }, [loadPosts]);
  // useEffect(() => {
  //   if (inView && hasMore && !loading) {
  //     loadPosts();
  //   }
  // }, [inView, hasMore, loading, loadPosts]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading ||
      !hasMore
    ) {
      return;
    }
    loadPosts();
  }, [loadPosts, loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleClick = () => {
    loadPosts();
  };

  return (
    <div>
      <Button onClick={handleClick}> load</Button>
      {loading && <Spinner />}
      {posts.map((post) => {
        return (
          <Post
            key={post.id}
            title={post.title}
            content={post.content}
            id={post.id}
            votes={post.votes}
          ></Post>
        );
      })}
      {/* <div ref={ref} /> */}
    </div>
  );
};

export default Feed;
