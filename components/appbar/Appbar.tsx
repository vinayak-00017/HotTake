import Link from "next/link";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import Profile from "./Profile";
import Notifications from "./Notifications";

const Appbar = () => {
  return (
    <header className="p-5 flex justify-between">
      <Link href="/">HOtTake</Link>
      <div>search</div>
      <ModeToggle></ModeToggle>
      <div>create</div>
      <Notifications></Notifications>
      <Profile></Profile>
    </header>
  );
};

export default Appbar;
