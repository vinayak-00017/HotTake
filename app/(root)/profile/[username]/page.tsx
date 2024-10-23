"use client";

import ProfileFeed from "@/components/profile/ProfileFeed";
import ProfileHeader from "@/components/profile/ProfileHeader";
import Spinner from "@/components/Spinner";
import { getProfileUser } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import React from "react";

const Page = () => {
  const { username } = useParams();
  const parsedUsername = Array.isArray(username) ? username[0] : username;

  const { isLoading, data, error } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () => getProfileUser(parsedUsername),
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>An error occured</div>;
  }

  return (
    data && (
      <div>
        <ProfileHeader user={data} />
        <ProfileFeed user={data} />
      </div>
    )
  );
};

export default Page;
