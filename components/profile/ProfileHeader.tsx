"use client";

import React from "react";
import EditProfileDialog from "./EditProfileDialog";

export type UserProfile = {
  name: string | null;
  username: string;
  profilePic: string | null;
  id: string;
};

const ProfileHeader = ({ user }: { user: UserProfile }) => {
  return (
    <div>
      ProfileHeader
      <h3>{user.name}</h3>
      <h4>{user.username}</h4>
      <p>bio</p>
      <EditProfileDialog user={user} />
    </div>
  );
};

export default ProfileHeader;
