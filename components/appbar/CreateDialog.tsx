"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState } from "react";
import { Input } from "../ui/input";
import { createPost } from "@/lib/actions/post";
import { CreatePostPlus, Cross } from "@/utils/Icons";
import Spinner from "../Spinner";

import { generateTags } from "@/lib/actions/ai";
import PostCloseAlert from "./PostCloseAlert";

const CreateDialog = () => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [warning, setWarning] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (title) {
      setLoading(true);
      await createPost({ title, content });
    } else {
      window.confirm("Are you sure you want to close without saving?");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCloseAttempt();
    } else {
      setIsOpen(open);
    }
  };

  const handleCloseAttempt = () => {
    if (title || content) {
      setIsAlertOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleCancleClose = () => {
    setIsAlertOpen(false);
  };

  const handleConfirmClose = () => {
    setContent("");
    setTitle("");
    setIsOpen(false);
  };

  const generateTagsFromAI = async () => {
    if (!content && !title) {
      setWarning(true);
      return;
    }
    if (tags.length < 5) setWarning(false);
    const data = await generateTags(title, content);
    const generatedTags = data.map((tag: string) => tag.toLowerCase());
    setTags((prevTags) => {
      const uniqueTags = generatedTags.filter(
        (tag: string) => !prevTags.includes(tag)
      );
      return [...prevTags, ...uniqueTags];
    });
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      setTags((prevTags) => [...prevTags, tagInput.trim().toLowerCase()]);
      setTagInput("");
      e.preventDefault();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="outline" className="rounded-full">
            <CreatePostPlus />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] ">
          <DialogHeader>
            <DialogTitle>Create</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="flex items-center flex-wrap border rounded p-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-slate-600 text-white rounded px-2 mx-1 my-1"
                >
                  <button onClick={() => handleRemoveTag(tag)}>
                    <Cross className="h-4 w-4 cursor-pointer mx-1" />
                  </button>
                  {tag}
                </div>
              ))}
              <input
                className="flex-grow p-1 border-none outline-none bg-inherit"
                placeholder="Add tags"
                value={tagInput}
                onKeyDown={handleTagInputKeyPress}
                onChange={(e) => setTagInput(e.target.value)}
              />
            </div>
            {warning && <div>Please input content to generate tags</div>}
            <div className="gap-4 py-4">
              <Input
                placeholder="What spicy dish are you cookin?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Description..."
                className=" resize-y w-full"
              />
            </div>
          </DialogDescription>

          <DialogFooter>
            {!loading ? (
              <DialogClose>
                <Button onClick={handleSubmit}>Post</Button>
              </DialogClose>
            ) : (
              <Spinner />
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PostCloseAlert
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        handleCancleClose={handleCancleClose}
        handleConfirmClose={handleConfirmClose}
      />
    </>
  );
};

export default CreateDialog;
