import Link from "next/link";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import Profile from "./Profile";
import Notifications from "./Notifications";
import { SigninDialog } from "./SigninDailog";
import CreateDialog from "./CreateDialog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

const Appbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <header className="p-5 flex justify-between">
      <Link href="/">HOtTake</Link>
      <div>search</div>
      <ModeToggle></ModeToggle>
      <CreateDialog></CreateDialog>
      <Notifications></Notifications>
      {session?.user && <Profile></Profile>}
      {!session?.user && <SigninDialog></SigninDialog>}
    </header>
  );
};

export default Appbar;
