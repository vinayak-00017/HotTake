"use client";

import Comments from "@/components/post/Comments";
import Post from "@/components/post/Post";
import React from "react";

const page = () => {
  return (
    <div className="flex flex-col items-center justify-between p-24">
      <Post />
      <Comments />
    </div>
  );
};

export default page;
