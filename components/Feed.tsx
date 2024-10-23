"use client";

import { infinitePosts } from "@/lib/actions/post";
import React, { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Spinner } from "@/utils/Icons";
import Posts from "./post/Posts";
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
type InfinitePostsResponse = {
  data: PostType[];
  nextCursor: number | null;
};
const Feed = () => {
  const [page, setPage] = useState<number>(0);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { ref, inView } = useInView();

  // const fetchPosts = async () => {
  //   setLoading(true);
  //   const fetchedPosts: PostType[] = await infinitePosts(page);
  //   setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
  //   setPage((page) => page + 1);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   if (inView) {
  //     fetchPosts();
  //   }
  // }, [inView]);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<InfinitePostsResponse>({
    queryKey: ["infinitePosts"],
    queryFn: ({ pageParam }) => infinitePosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  return status === "pending" ? (
    <Spinner></Spinner>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map((post) => (
            <Posts
              user={post.user}
              key={post.id}
              title={post.title}
              content={post.content}
              id={post.id}
              votes={post.votes}
              commentCount={post.commentCount}
            ></Posts>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
  // <div>
  //   {/* <div ref={ref}></div>
  //   <button onClick={fetchPosts}>load more</button> */}
  // </div>
};

export default Feed;
