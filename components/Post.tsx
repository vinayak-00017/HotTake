import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const Post = () => {
  return (
    <article className="w-[50vw] flex justify-center flex-col items-center">
      <h5>poster</h5>
      <h2>Post title</h2>
      <p>Post content...</p>
      <footer>
        <Button>UP</Button>
        <Button>Down</Button>
      </footer>
    </article>
  );
};

export default Post;
