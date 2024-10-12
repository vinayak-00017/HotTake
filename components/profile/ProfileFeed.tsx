"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import OverviewFeed from "./OverviewFeed";
import PostsFeed from "./PostsFeed";

const ProfileFeed = () => {
  const [selectedFeed, setSelectedFeed] = useState("overview");

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
