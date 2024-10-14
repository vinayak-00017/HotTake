import Link from "next/link";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import Profile from "./Profile";
import Notifications from "./Notifications";
import { SigninDialog } from "./SigninDailog";
import CreateDialog from "./CreateDialog";
import { authOptions } from "@/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import { getUsername } from "@/lib/actions/user";

const Appbar: React.FC = async (): Promise<JSX.Element> => {
  const session = await getServerSession(authOptions);

  let username: string | null = null;
  if (session?.user) {
    const fetchedUsername = await getUsername(session.user.id);
    if (fetchedUsername) {
      username = fetchedUsername;
    }
  }

  return (
    <header className="p-5 flex justify-between bg-zinc-700">
      <Link href="/">HOtTake</Link>
      <div>search</div>
      <ModeToggle></ModeToggle>
      {session?.user && <CreateDialog></CreateDialog>}
      {session?.user && <Notifications></Notifications>}
      {session?.user && username && (
        <Profile
          username={username}
          name={session.user.name}
          profilePic={session.user.image}
        ></Profile>
      )}
      {!session?.user && <SigninDialog></SigninDialog>}
    </header>
  );
};

export default Appbar;
