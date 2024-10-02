import Link from "next/link";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import Profile from "./Profile";
import Notifications from "./Notifications";
import { SigninDialog } from "./SigninDailog";
import CreateDialog from "./CreateDialog";
import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";

const Appbar = async () => {
  // const session = useSession();
  const session = await getServerSession(authOptions);

  return (
    <header className="p-5 flex justify-between">
      <Link href="/">HOtTake</Link>
      <div>search</div>
      <ModeToggle></ModeToggle>
      {session?.user && <CreateDialog></CreateDialog>}
      {session?.user && <Notifications></Notifications>}
      {session?.user && <Profile></Profile>}
      {!session?.user && <SigninDialog></SigninDialog>}
    </header>
  );
};

export default Appbar;
