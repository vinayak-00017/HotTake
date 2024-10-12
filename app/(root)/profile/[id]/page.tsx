import ProfileFeed from "@/components/profile/ProfileFeed";
import ProfileHeader from "@/components/profile/ProfileHeader";
import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import React from "react";

const page = () => {
  const session = getServerSession(authOptions);
  return (
    <div>
      <ProfileHeader />
      <ProfileFeed />
    </div>
  );
};

export default page;
