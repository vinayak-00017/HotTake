import React from "react";
import { Button } from "./ui/button";
import { allPosts } from "@/lib/actions/post";
import { posts } from "@/lib/db/src/schema";
import { title } from "process";

const Post = ({ title, content }: { title: string; content: string }) => {
  return (
    <article className="w-[50vw] flex justify-center flex-col items-center">
      <h5>poster</h5>
      <h2>{title}</h2>
      <p>{content}</p>
      <footer>
        <Button>UP</Button>
        <Button>Down</Button>
      </footer>
    </article>
  );
};
export default Post;
