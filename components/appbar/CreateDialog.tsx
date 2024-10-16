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
import { CreatePostPlus } from "@/utils/Icons";
import Spinner from "../Spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

const CreateDialog = () => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

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

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancleClose}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateDialog;
