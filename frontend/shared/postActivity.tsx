"use client";
import { deleteTweetMutate } from "@/graphql/mutation/tweet";
import { Tweet } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiFrown } from "react-icons/bs";
import { FiUserX } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";
import { MdDelete, MdEditDocument } from "react-icons/md";
import { PiSpeakerSimpleSlash } from "react-icons/pi";

const PostActivity = ({
  setPostControlDialogOpen,
  singleTweet,
}: {
  setPostControlDialogOpen: any;
  singleTweet: Tweet;
}) => {
  const postRef = useRef<HTMLDivElement>(null);
  const { user } = useCurrentUser();
  console.log(singleTweet, "single tweet twer");
  const [isUserPost, setIsUserPost] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: deleteTweetMutate,
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({
        queryKey: ["single-tweet", "all-tweet", singleTweet.id],
      });
      router.replace("/");
      queryClient.refetchQueries({ queryKey: ["all-tweet"] });
    },
  });
  const handleDeletePost = async (id: string) => {
    if (!id) {
      return;
    }
    const body = {
      tweetId: id,
    };
    try {
      await mutation.mutateAsync(body);
      setPostControlDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user || !singleTweet) {
      return;
    }
    console.log(user.id);
    console.log(singleTweet.author.id);

    if (user.id === singleTweet.author.id) {
      setIsUserPost(true);
    } else {
      setIsUserPost(false);
    }
  }, [singleTweet.id, user]);
  useEffect(() => {
    const handlePostDialog = (event: MouseEvent) => {
      if (postRef.current && !postRef.current.contains(event.target as Node)) {
        setPostControlDialogOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePostDialog);

    return () => {
      document.removeEventListener("mousedown", handlePostDialog);
    };
  }, [setPostControlDialogOpen]);
  return (
    <div
      ref={postRef}
      style={{
        boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
      }}
      className="absolute text-white p-4 py-8 right-0 top-0 z-[100] w-[350px] h-auto bg-black rounded-[15px]"
    >
      <div className="flex flex-col gap-6">
        {isUserPost ? (
          <div className=" flex flex-col gap-6">
            <button
              onClick={() => handleDeletePost(singleTweet.id)}
              className="flex gap-3 items-center font-[600] text-red-500"
            >
              <MdDelete className="font-[600] text-[20px]" />
              Delete
            </button>
            <button className="flex gap-3 items-center font-[600]">
              <MdEditDocument className="font-[600] text-[17px]" />
              Edit
            </button>
          </div>
        ) : (
          <div className=" flex flex-col gap-6">
            <button className="flex gap-3 items-center font-[600]">
              <BsEmojiFrown className="font-[600] text-[17px]" />
              Not interested in this post
            </button>
            <button className="flex gap-3 items-center font-[600]">
              {" "}
              <FiUserX className="font-[600] text-[17px]" />
              Unfollow @{singleTweet?.author.userName}
            </button>
            <button className="flex gap-3 items-center font-[600]">
              <PiSpeakerSimpleSlash className="font-[600] text-[17px]" />
              Mute @{singleTweet?.author.userName}
            </button>
          </div>
        )}
        <button className="flex gap-3 items-center font-[600]">
          <IoIosStats className="font-[600] text-[17px]" />
          View post engagements
        </button>
      </div>
    </div>
  );
};

export default PostActivity;
