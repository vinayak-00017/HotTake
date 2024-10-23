import { profileInfinitePosts } from "@/lib/actions/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import Spinner from "../Spinner";
import { UserProfile } from "./ProfileHeader";
import { UserType } from "../Feed";
import Posts from "../post/Posts";

const PostsFeed = ({ user }: { user: UserType }) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["infinitePosts", user.id],
    queryFn: ({ pageParam }) => profileInfinitePosts(pageParam, user.id),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  console.log(data);
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
              user={user}
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

export default PostsFeed;
