"use client";
import React, { use, useEffect, useState } from "react";
import { BsChat } from "react-icons/bs";
import { CiBookmark, CiHeart } from "react-icons/ci";
import { FaDotCircle, FaHeart } from "react-icons/fa";
import {
  IoEllipseOutline,
  IoEllipsisHorizontal,
  IoShareOutline,
} from "react-icons/io5";
import { ImLoop } from "react-icons/im";
import { LuDot, LuRepeat2 } from "react-icons/lu";
import DivisionBar from "@/shared/divisionbar";
import Image from "next/image";
import { useAllTweet } from "@/hooks/tweet";
import { Tweet } from "@/graphql/types";
import { getRandomDarkHexColor } from "@/lib/randomColor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeTweet } from "@/graphql/mutation/like";
import { useCurrentUser } from "@/hooks/user";
import Comment from "./comment";
import { useRouter } from "next/navigation";

const SinglePost = ({ tweet }: { tweet: Tweet }) => {
  const [liked, setLiked] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { user } = useCurrentUser();

  const mutation = useMutation({
    mutationFn: toggleLikeTweet,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["all-tweet"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  async function handleTweetLike() {
    setLiked((prevVal) => !prevVal);
    const body = {
      tweetId: tweet.id,
    };
    try {
      await mutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (tweet.LikedBy && user) {
      setLiked(tweet.LikedBy.some((like) => like.userId === user.id));
    }
  }, [tweet, user]);

  const handlePostClick = (id: string) => {
    router.push(`/${tweet.author.userName}/status/${id}`);
  };
  console.log(tweet.author, "twwet-author");
  return (
    <div className="w-full cursor-pointer py-3 px-2">
      <div className="flex gap-4 w-full">
        <div>
          {tweet.author?.profileImgUrl ? (
            <div>
              {tweet.author?.profileImgUrl.startsWith("#") ? (
                <div
                  style={{ backgroundColor: tweet.author?.profileImgUrl }}
                  className="rounded-full w-10 h-10 flex items-center justify-center capitalize"
                >
                  {tweet.author?.firstName.slice(0, 1)}
                </div>
              ) : (
                <Image
                  src={tweet?.author?.profileImgUrl}
                  alt=""
                  width={40}
                  height={40}
                />
              )}
            </div>
          ) : (
            <div className="rounded-full w-10 h-10 bg-blue-900 flex items-center justify-center capitalize">
              {tweet.author?.firstName.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="w-full px-4">
          <div className="flex justify-between w-full ">
            <div className="flex gap-1 items-center">
              <p className="capitalize font-[600] text-[17px]">
                {tweet.author?.firstName}
              </p>
              <p className="gray font-[300]">@{tweet.author?.userName}</p>
              <p>
                <LuDot className="gray font-[300]" />
              </p>
              <p className="gray font-[300]">5h</p>
            </div>
            <div>
              <IoEllipsisHorizontal className="gray" />
            </div>
          </div>
          <div onClick={() => handlePostClick(tweet.id)}>{tweet?.content}</div>
          <div onClick={() => handlePostClick(tweet.id)} className="py-2">
            <Image
              alt=""
              width={200}
              height={200}
              src="/img.jpg"
              className="w-full rounded-[10px]"
            />
          </div>
          <div className="flex justify-between py-2 pt-3 pb-4">
            <Comment tweet={tweet} user={user!} />
            <div className="flex gap-1 items-center gray text-[13px] font-[400]">
              <LuRepeat2 className="text-[20px] " />
              34k
            </div>
            <div
              onClick={handleTweetLike}
              className="flex gap-1 items-center gray text-[13px] cursor-pointer font-[400]"
            >
              {liked ? (
                <FaHeart className="text-[20px] heart-animation text-red-500" />
              ) : (
                <CiHeart className="text-[20px] " />
              )}
              2344k
            </div>
            <div className="flex gap-1 items-center gray text-[13px] font-[400]">
              <IoShareOutline className="text-[20px] " />
            </div>
            <div className="flex gap-1 items-center gray text-[13px] font-[400]">
              <CiBookmark className="text-[20px] " />
            </div>
          </div>
        </div>
      </div>
      <DivisionBar type="x" />
    </div>
  );
};

export default SinglePost;
