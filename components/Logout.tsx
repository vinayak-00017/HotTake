"use client";

import { signOut, useSession } from "next-auth/react";
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
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
};

export default Logout;
