import { CommentIcon, Fire, Trash } from "@/utils/Icons";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getVoteType, handleVote } from "@/lib/actions/votes";
import { Vote } from "@/utils/posts";

const PostFooter = ({
  postId,
  votes,
  commentCount,
  handleClick,
}: {
  postId: string;
  votes: number;
  commentCount: number | null;
  handleClick: () => void;
}) => {
  const [vote, setVote] = useState<"UP" | "DOWN" | null>(null);
  const [voteCount, setVoteCount] = useState<number>(votes);

  useEffect(() => {
    const fetchVote = async () => {
      const fetchedVote = await getVoteType(postId);
      setVote(fetchedVote);
    };
    fetchVote();
  }, [postId]);
  const handleUp = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const result = await handleVote({ postId, type: Vote.UP });
    if (typeof result.totalVotes === "number") {
      setVoteCount(result.totalVotes);
    }
    if (result.flag == true) {
      setVote(Vote.UP);
    } else {
      setVote(null);
    }
  };
  const handleDown = async (event: React.MouseEvent) => {
    event.stopPropagation();
    const result = await handleVote({ postId, type: Vote.DOWN });
    if (typeof result.totalVotes === "number") {
      setVoteCount(result.totalVotes);
    }
    if (result.flag == true) {
      setVote(Vote.DOWN);
    } else {
      setVote(null);
    }
  };

  return (
    <footer className="flex justify-start">
      <div className="flex items-center buttons mx-4">
        <Button
          onClick={(event) => handleUp(event)}
          className={`hover:bg-orange-400 transition-colors duration-200 rounded-full`}
        >
          <Fire
            className={`${vote === "UP" ? "fill-orange-500 text-orange-900" : "hover:text-orange-700"}`}
          />
        </Button>
        {voteCount}
        <Button
          onClick={(event) => handleDown(event)}
          className="hover:bg-gray-800 transition-colors duration-200 rounded-full"
        >
          <Trash
            className={`${vote === "DOWN" ? "fill-gray-500 text-gray-400" : "hover:text-gray-700"}`}
          />
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
