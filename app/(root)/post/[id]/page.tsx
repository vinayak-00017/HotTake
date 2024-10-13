"use client";

import Comments from "@/components/post/Comments";
import Post from "@/components/post/Post";
import { getUser } from "@/lib/actions/user";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getUser();
      setUser(fetchUser);
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-between p-24">
      <Post />
      <Comments />
    </div>
  );
};

export default Page;
