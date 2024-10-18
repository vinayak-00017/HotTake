import { getUser } from "@/lib/actions/user";
import React from "react";

const ProfileHeader = async () => {
  const user = await getUser();
  return (
    <div>
      ProfileHeader
      <h3>name</h3>
      <h4>username</h4>
      <p>bio</p>
    </div>
  );
};

export default ProfileHeader;
