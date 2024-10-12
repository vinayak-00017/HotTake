"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUsername } from "@/lib/actions/user";

const Profile = ({
  userId,
  name,
  profilePic,
}: {
  userId: string;
  name: string;
  profilePic: string;
}) => {
  const router = useRouter();

  // const handleProfileClick = async () => {
  //   const username = await getUsername(userId);
  //   router.push(`/profile/${username}`);
  // };

  return (
    <div className="rounded-full">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Image
            src={profilePic}
            alt="profile picture"
            width={40}
            height={40}
            className="rounded-full"
          ></Image>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`/profile/${userId}`)}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button onClick={() => signOut()}>Signout</Button>
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
