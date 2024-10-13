import {
  CommentIcon,
  CookingPotAfter,
  CookingPotBefore,
  Fire,
  Trash,
} from "@/utils/Icons";
import React from "react";
import { Button } from "../ui/button";

const PostFooter = ({
  id,
  votes,
  commentCount,
  handleClick,
  handleUp,
  handleDown,
}: {
  id: string;
  votes: number;
  commentCount: number | null;
  handleClick: () => void;
  handleUp: (id: string, event: React.MouseEvent) => void;
  handleDown: (id: string, event: React.MouseEvent) => void;
}) => {
  return (
    <footer className="flex justify-start">
      <div className="flex items-center buttons mx-4">
        <Button
          onClick={(event) => handleUp(id, event)}
          className="hover:bg-orange-900 transition-colors duration-200 rounded-full"
        >
          <Fire />
        </Button>
        {votes}
        <Button
          onClick={(event) => handleDown(id, event)}
          className="hover:bg-gray-800 transition-colors duration-200 rounded-full"
        >
          <Trash />
        </Button>
      </div>
      <Button onClick={handleClick} className="text-white buttons ">
        <CommentIcon />
        <span className="p-2">{commentCount ? commentCount : "reply"}</span>
      </Button>
    </footer>
  );
};

export default PostFooter;
