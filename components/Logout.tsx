"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "./ui/button";

const Logout = () => {
  const session = useSession();

  return (
    <div>
      <Button
        onClick={async () => {
          await signOut();
        }}
      >
        logout
      </Button>
      <Button
        onClick={async () => {
          await signIn();
        }}
      >
        Signin
      </Button>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default Logout;
