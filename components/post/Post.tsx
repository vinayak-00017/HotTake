import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CommentIcon, Fire, Spinner, Trash } from "@/utils/Icons";
import { singlePost } from "@/lib/actions/post";
import { PostType } from "../Feed";
import { handleDown, handleUp } from "./Posts";

const Post = () => {
  const [post, setPost] = useState<PostType>();

  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    const fetctPost = async () => {
      const fetchedPost = await singlePost(postId);
      setPost(fetchedPost);
    };
    fetctPost();
  }, [postId]);

  return !post ? (
    <Spinner></Spinner>
  ) : (
    <section>
      <h5>{post.user?.username}</h5>
      <h2 className="font-bold  text-2xl my-2">{post.title}</h2>
      <p>{post.content}</p>
      <footer className="flex ">
        <div className="flex items-center buttons mx-4">
          <Button
            className="hover:bg-orange-800 transition-colors duration-200 rounded-full"
            onClick={(event) => handleUp(post.id, event)}
          >
            <Fire />
          </Button>
          {post.votes}
          <Button
            className="hover:bg-gray-800 transition-colors duration-200 rounded-full"
            onClick={(event) => handleDown(post.id, event)}
          >
            <Trash />
          </Button>
        </div>
        <Button className="text-white buttons ">
          <CommentIcon />
          <span className="p-2">
            {post.commentCount ? post.commentCount : "reply"}
          </span>
        </Button>
      </footer>
    </section>
  );
};

export default Post;
