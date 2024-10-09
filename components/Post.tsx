import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CommentIcon, Spinner } from "@/utils/Icons";
import { singlePost } from "@/lib/actions/post";
import { PostType } from "./Feed";
import { handleDown, handleUp } from "./Posts";
import { calculateVotes } from "@/utils/posts";

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
      <h5>poster</h5>
      <h2 className="font-bold  text-2xl my-2">{post.title}</h2>
      <p>{post.content}</p>
      <footer className="flex ">
        <div className="buttons mx-4">
          <Button
            className="hover:bg-gray-800 transition-colors duration-200 rounded-full"
            onClick={() => handleUp(post.id)}
          >
            UP{" "}
          </Button>
          {calculateVotes(post.votes)}
          <Button
            className="hover:bg-gray-800 transition-colors duration-200 rounded-full"
            onClick={() => handleDown(post.id)}
          >
            Down
          </Button>
        </div>
        <Button className="text-white buttons ">
          <CommentIcon />
        </Button>
      </footer>
    </section>
  );
};

export default Post;
