import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { PointerType } from "./SettingsHeader";

const SettingsHeaderButton = ({
  setPointer,
  section,
  pointer,
}: {
  section: PointerType;
  pointer: PointerType;
  setPointer: React.Dispatch<React.SetStateAction<PointerType>>;
}) => {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push(`/settings/${section}`);
        setPointer(section);
      }}
      className={`py-2 px-4 ${pointer === section ? "border-b-2 border-white" : "hover:border-b-2 border-gray-500"}`}
    >
      {section.charAt(0).toUpperCase() + section.slice(1)}
    </Button>
  );
};
export default SettingsHeaderButton;
