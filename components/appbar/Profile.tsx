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
import Link from "next/link";

const Profile = ({
  username,
  name,
  profilePic,
}: {
  username: string;
  name: string;
  profilePic: string;
}) => {
  const router = useRouter();

  return (
    <div className="rounded-full bg-slate-800">
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
        <DropdownMenuContent className="bg-slate-900 rounded-xl ">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href={`/profile/${username}`}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button onClick={() => signOut()}>Signout</button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/settings"}>Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profile;
