import { allPosts } from "@/lib/actions/post";
import React from "react";
import Post from "./Post";
import { PasswordInput } from "./ui/passwordInput";

const Feed = async () => {
  const posts = await allPosts();

  return (
    <div>
      {posts.map((post) => {
        return (
          <Post key={post.id} title={post.title} content={post.content}></Post>
        );
      })}
    </div>
  );
};

export default Feed;
