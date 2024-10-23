"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import OverviewFeed from "./OverviewFeed";
import PostsFeed from "./PostsFeed";
import { UserProfile } from "./ProfileHeader";
import { UserType } from "../Feed";

const ProfileFeed = ({ user }: { user: UserType }) => {
  const [selectedFeed, setSelectedFeed] = useState("posts");

  const renderFeed = (): JSX.Element => {
    switch (selectedFeed) {
      case "overview":
        return <OverviewFeed />;
      case "posts":
        return <PostsFeed user={user} />;
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
