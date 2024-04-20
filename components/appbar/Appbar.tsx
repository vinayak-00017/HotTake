import Link from "next/link";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import Profile from "./Profile";
import Notifications from "./Notifications";
import { SigninDialog } from "../SigninDailog";

const Appbar = () => {
  return (
    <header className="p-5 flex justify-between">
      <Link href="/">HOtTake</Link>
      <div>search</div>
      <ModeToggle></ModeToggle>
      <div>create</div>
      <Notifications></Notifications>
      <Profile></Profile>
      <SigninDialog></SigninDialog>
    </header>
  );
};

export default Appbar;
