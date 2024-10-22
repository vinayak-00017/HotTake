import { generateTags } from "@/lib/actions/ai";
import { createPost } from "@/lib/actions/post";
import { useState } from "react";

const useCreateDialog = () => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [warning, setWarning] = useState<boolean>(false);
  const [tagsLimitWarning, setTagsLimitWarning] = useState<boolean>(false);
  const [aiWarning, setAiWarning] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (title) {
      setLoading(true);
      await createPost({ title, content, inputTags: tags });
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
    if (tags.length < 5) {
      setAiLoading(true);
      setWarning(false);
      const count = 5 - tags.length;
      const data = await generateTags(title, content, count);
      if (data.status === 200) {
        const generatedTags = data.tags.map((tag: string) => tag.toLowerCase());
        setTags((prevTags) => {
          const uniqueTags = generatedTags.filter(
            (tag: string) => !prevTags.includes(tag)
          );
          return [...prevTags, ...uniqueTags];
        });
      } else {
        setAiWarning(true);
      }
    } else {
      setTagsLimitWarning(true);
      return;
    }
    setAiLoading(false);
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (tags.length < 5) {
      if (e.key === "Enter" && tagInput.trim() !== "") {
        setTags((prevTags) => [...prevTags, tagInput.trim().toLowerCase()]);
        setTagInput("");
        e.preventDefault();
      }
    } else {
      setTagsLimitWarning(true);
      return;
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
    setTagsLimitWarning(false);
  };
  return {
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
    title,
    setTitle,
    setContent,
    content,
    loading,
    handleSubmit,
    isAlertOpen,
    setIsAlertOpen,
    handleCancleClose,
    handleConfirmClose,
  };
};

export default useCreateDialog;
