import { CommentIcon } from "@/utils/Icons";
import { calculateVotes, Vote } from "@/utils/posts";
import React from "react";
import { handleUp, handleDown } from "./Posts";
import { Button } from "./ui/button";

const PostFooter = ({
  id,
  votes,
  handleClick,
  handleUp,
  handleDown,
}: {
  id: string;
  votes: Vote[];
  handleClick: () => void;
  handleUp: (id: string) => void;
  handleDown: (id: string) => void;
}) => {
  return (
    <footer className="flex ">
      <div className="buttons mx-4">
        <Button
          onClick={() => handleUp(id)}
          className="hover:bg-gray-800 transition-colors duration-200 rounded-full"
        >
          UP{" "}
        </Button>
        {calculateVotes(votes)}
        <Button
          onClick={() => handleDown(id)}
          className="hover:bg-gray-800 transition-colors duration-200 rounded-full"
        >
          Down
        </Button>
      </div>
      <Button onClick={handleClick} className="text-white buttons ">
        <CommentIcon />
      </Button>
    </footer>
  );
};

export default PostFooter;
