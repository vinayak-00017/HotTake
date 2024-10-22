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

import { Input } from "../ui/input";
import { CreatePostPlus, Cross } from "@/utils/Icons";
import Spinner from "../Spinner";
import PostCloseAlert from "./PostCloseAlert";
import useCreateDialog from "@/hooks/appbar/useCreateDialog";

const CreateDialog = () => {
  const {
    isOpen,
    handleOpenChange,
    tags,
    handleRemoveTag,
    tagInput,
    handleTagInputKeyPress,
    setTagInput,
    generateTagsFromAI,
    aiLoading,
    warning,
    aiWarning,
    tagsLimitWarning,
    setTitle,
    title,
    setContent,
    content,
    loading,
    handleSubmit,
    isAlertOpen,
    setIsAlertOpen,
    handleCancleClose,
    handleConfirmClose,
  } = useCreateDialog();

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
                placeholder="Add tags, press enter after every tag"
                value={tagInput}
                onKeyDown={handleTagInputKeyPress}
                onChange={(e) => setTagInput(e.target.value)}
              />
            </div>
            <Button className="bg-slate-500" onClick={generateTagsFromAI}>
              {!aiLoading ? "generated tags with AI" : <Spinner />}
            </Button>
            {warning && (
              <div className="text-red-700">
                Please input content to generate tags
              </div>
            )}
            {tagsLimitWarning && (
              <div className="text-red-700">Max tag limit is 5</div>
            )}
            {aiWarning && (
              <div className="text-red-700">
                Ai doesn&apos;t like your wording, try adding custom tags
              </div>
            )}

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
