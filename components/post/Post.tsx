import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Spinner } from "@/utils/Icons";
import { singlePost } from "@/lib/actions/post";
import { PostType } from "../Feed";
import Image from "next/image";
import PostFooter from "./PostFooter";
import { useQuery } from "@tanstack/react-query";

const Post = () => {
  const [post, setPost] = useState<PostType>();

  const router = useRouter();
  const { id } = useParams();
  const postId = Array.isArray(id) ? id[0] : id;

  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["singlePost", postId],
    queryFn: () => singlePost(postId),
  });

  useEffect(() => {
    if (isSuccess && data) {
      setPost(data);
    }
  }, [isSuccess, data]);

  const handleClick = () => {};

  return !post ? (
    <Spinner></Spinner>
  ) : (
    <section>
      <div
        className="flex cursor-pointer"
        onClick={() => router.push(`/profile/${post.user?.username}`)}
      >
        <Image
          src={post.user?.profilePic || "/profilePic/redChili.webp"}
          alt="profilePic"
          width={48}
          height={48}
          className="h-10 w-10 rounded-full"
        />
        <div>
          <h5>{post.user?.name}</h5>
          <h6>@{post.user?.username}</h6>
        </div>
      </div>
      <h2 className="font-bold  text-2xl my-2">{post.title}</h2>
      <p>{post.content}</p>
      <PostFooter
        postId={post.id}
        votes={post.votes}
        commentCount={post.commentCount}
        handleClick={handleClick}
      />
    </section>
  );
};

export default Post;
