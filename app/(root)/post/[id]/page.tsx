"use client";

import Comments from "@/components/post/Comments";
import Post from "@/components/post/Post";
import { getUser } from "@/lib/actions/user";
import React, { useEffect, useState } from "react";

type userProps = {
  profilePic: string | null;
};

const initialUserState: userProps = {
  profilePic: null,
};

const Page = () => {
  const [user, setUser] = useState<userProps>(initialUserState);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser();
      if (fetchedUser && "username" in fetchedUser) {
        setUser(fetchedUser);
      } else {
        console.error("Failed to fetch user");
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-between p-24">
      <Post />
      <Comments profilePic={user?.profilePic} />
    </div>
  );
};

export default Page;
