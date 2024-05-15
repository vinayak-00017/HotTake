"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Input } from "../ui/input";
import { createPost } from "@/lib/actions/post";
import { useSession } from "next-auth/react";

const CreateDialog = () => {
  const [content, setContent] = useState<string>();
  const [title, setTitle] = useState<string>();
  const session = useSession();

  const handleSubmit = async () => {
    if (title && content) {
      await createPost({ title, content });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] ">
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
        </DialogHeader>
        <div className="gap-4 py-4">
          <Input
            placeholder="Title.."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What spicy dish are you cookin?"
            className=" resize-y w-full"
          />
        </div>

        <DialogFooter>
          <DialogClose>
            <Button onClick={handleSubmit}>Post</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
