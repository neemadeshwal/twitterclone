"use client";
import { Tweet } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import { TrashIcon } from "@radix-ui/react-icons";
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
  const [isUserPost, setIsUserPost] = useState(false);

  useEffect(() => {
    if (user?.id === singleTweet?.author.id) {
      setIsUserPost(true);
    } else {
      setIsUserPost(false);
    }
  }, [singleTweet.id]);
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
            <button className="flex gap-3 items-center font-[600] text-red-500">
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
