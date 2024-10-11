import { CommentIcon } from "@/utils/Icons";
import { calculateVotes, Vote } from "@/utils/posts";
import React from "react";
import { Button } from "./ui/button";

const PostFooter = ({
  id,
  votes,
  commentCount,
  handleClick,
  handleUp,
  handleDown,
}: {
  id: string;
  votes: Vote[];
  commentCount: number | null;
  handleClick: () => void;
  handleUp: (id: string, event: React.MouseEvent) => void;
  handleDown: (id: string, event: React.MouseEvent) => void;
}) => {
  return (
    <footer className="flex justify-start">
      <div className="buttons mx-4">
        <Button
          onClick={(event) => handleUp(id, event)}
          className="hover:bg-gray-800 transition-colors duration-200 rounded-full"
        >
          UP{" "}
        </Button>
        {calculateVotes(votes)}
        <Button
          onClick={(event) => handleDown(id, event)}
          className="hover:bg-gray-800 transition-colors duration-200 rounded-full"
        >
          Down
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
