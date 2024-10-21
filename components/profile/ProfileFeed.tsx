"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import OverviewFeed from "./OverviewFeed";
import PostsFeed from "./PostsFeed";
import { useQuery } from "@apollo/client";
import { GET_INFINITE_POSTS } from "@/lib/apollo/queries/posts";

const ProfileFeed = () => {
  const [selectedFeed, setSelectedFeed] = useState("overview");
  const { loading, error, data } = useQuery(GET_INFINITE_POSTS);
  console.log(data);

  const renderFeed = (): JSX.Element => {
    switch (selectedFeed) {
      case "overview":
        return <OverviewFeed />;
      case "posts":
        return <PostsFeed />;
      default:
        return <OverviewFeed />;
    }
  };

  return (
    <section>
      <nav className="flex">
        <Button onClick={() => setSelectedFeed("overview")}>Overview</Button>
        <Button onClick={() => setSelectedFeed("posts")}>Posts</Button>
        <Button onClick={() => setSelectedFeed("comments")}>comments</Button>
      </nav>

      <section>{renderFeed()}</section>
    </section>
  );
};

export default ProfileFeed;
