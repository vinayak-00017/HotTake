import { Vote } from "./posts";

export type Comment = {
  id: string;
  content: string;
  user: {
    username: string;
    name: string | null;
    profilePic: string | null;
    id: string;
  };
  parentId: string | null;
  postId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  votes: number;
  children?: Comment[];
};

export function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap: { [key: string]: Comment } = {};
  const roots: Comment[] = [];

  comments.forEach((comment) => {
    comment.children = [];
    commentMap[comment.id] = comment;
  });

  comments.forEach((comment) => {
    if (comment.parentId) {
      const parent = commentMap[comment.parentId];
      if (parent) {
        parent.children!.push(comment);
      }
    } else {
      roots.push(comment);
    }
  });

  return roots;
}
