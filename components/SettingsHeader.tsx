"use client";

import React, { useState } from "react";
import SettingsHeaderButton from "./SettingsHeaderButton";

export type PointerType =
  | "account"
  | "profile"
  | "preferences"
  | "security"
  | "notifications";

const SettingsHeader = () => {
  const [pointer, setPointer] = useState<PointerType>("account");

  const sections: PointerType[] = [
    "account",
    "profile",
    "preferences",
    "security",
    "notifications",
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <nav className="flex space-x-4">
        {sections.map((section) => (
          <SettingsHeaderButton
            key={section}
            pointer={pointer}
            setPointer={setPointer}
            section={section}
          />
        ))}
      </nav>
    </section>
  );
};

export default SettingsHeader;
