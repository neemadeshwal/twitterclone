"use client";
import { createComment } from "@/graphql/mutation/comment";
import { getCurrentUser, Tweet } from "@/graphql/types";
import { getRandomDarkHexColor } from "@/lib/randomColor";
import CurrentUser from "@/shared/currentUser";
import DivisionBar from "@/shared/divisionbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiLeftArrow, BiX } from "react-icons/bi";
import { BsChat, BsEmojiSmile } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { HiOutlinePhotograph } from "react-icons/hi";
import { LuDot, LuFolderClock } from "react-icons/lu";
import { MdOutlineGifBox } from "react-icons/md";
import { RiListRadio } from "react-icons/ri";

const Comment = ({
  tweet,
  user,
  iconColor,
}: {
  tweet: Tweet;
  user: getCurrentUser;
  iconColor?: string;
}) => {
  const [showDialogBox, setShowDialogBox] = useState(false);
  const [tweetComment, setTweetComment] = useState("");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: (response: any) => {
      console.log(response);
      setTweetComment("");
      setShowDialogBox(false);
      queryClient.invalidateQueries({
        queryKey: ["all-tweet"],
      });
      queryClient.invalidateQueries({
        queryKey: ["single-tweet"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleComment = async () => {
    const body = {
      comment: tweetComment,
      tweetId: tweet.id,
      mediaArray: [],
    };

    try {
      await mutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        onClick={() => setShowDialogBox(true)}
        className={`flex gap-[2px] sm:gap-1 items-center ${
          iconColor == "white" ? "white" : "gray"
        }  text-[13px] font-[400] cursor-pointer`}
      >
        <BsChat className="text-[16px] sm:text-[20px]" />
        <p>{tweet?.commentAuthor.length}</p>
      </div>
      {showDialogBox && (
        <div className="fixed top-0 left-0 w-full h-full z-[1000] dimBg flex items-center justify-center">
          <div className="bg-black  z-[1000]  md:rounded-[20px] w-full  md:w-[600px]  h-full">
          <div className="  w-full   pt-20  relative p-4 md:pt-14 h-[60%] md:h-full flex gap-2 ">
            <div
              className="absolute top-2 left-2 rounded-full p-1 hover:bg-[#0f0f0f] cursor-pointer"
              onClick={() => setShowDialogBox(false)}
            >

              <BiX className="text-[30px] hidden md:block" />
              <div>
              <FaArrowLeft/>

              </div>
            </div>
            <div
              className="absolute top-2 md:hidden right-2 rounded-full p-1 hover:bg-[#0f0f0f] cursor-pointer"
            >

<button
                    onClick={handleComment}
                    className="py-[0.4rem] rounded-full x-bgcolor px-6"
                  >
                    Reply
                  </button>
            </div>
            <div className="flex w-fit md:items-center flex-col gap-1 h-full md:justify-center  ">
              <div className="min-h-[50px] h-[45%] md:h-full flex items-center  flex-col gap-2">
                {tweet.author?.profileImgUrl ? (
                  <div>
                    {tweet.author?.profileImgUrl.startsWith("#") ? (
                      <div
                        className="rounded-full w-10 h-10 flex items-center justify-center capitalize"
                        style={{ backgroundColor: tweet.author?.profileImgUrl }}
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
                <div className="w-1 h-full bg-[#2c2c2cb2] min:h-[100px]"></div>
              </div>
              <div className="py-3 pt-5">
                <CurrentUser />
              </div>
            </div>
            <div className="w-full">
              <div>
                <div className="flex gap-1 items-center mt-1">
                  <p className="capitalize font-[600] text-[17px] ">
                    {tweet.author?.firstName} {tweet.author?.lastName}
                  </p>
                  <p className="gray font-[300]">@{tweet.author?.userName}</p>
                  <p>
                    <LuDot className="gray font-[300]" />
                  </p>
                  <p className="gray font-[300]">5h</p>
                </div>
                <div className="py-3">{tweet?.content}</div>
                {
                  tweet?.mediaArray&&tweet?.mediaArray.length!==0&&
                  <div className="pr-4"
                  
                >
                  {tweet?.mediaArray?.map((url, index) => (
                    <div
                      key={url}
                      className="relative break-all"
                    >
                     {url}
                    </div>
                  ))}
                </div>
                }
                <div className="gray font-[500] text-[13px] py-1">
                  Replying to{" "}
                  <p className="x-textcolor inline">
                    @{tweet.author?.userName}
                  </p>
                </div>
              </div>
              <div className="py-2 pt-4 w-full">
                <div className="w-full mt-2 px-2">
                  <textarea
                    value={tweetComment}
                    onChange={(e) => setTweetComment(e.target.value)}
                    rows={3}
                    autoFocus
                    className="text-[20px] bg-transparent resize-none outline-none border-0 w-full placeholder:text-gray-600"
                    placeholder="Post your reply"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 md:bottom-4 left-4 w-full">
              <div className=" flex  justify-between pr-6">
                <div className="flex gap-2 ">
                  <div className="rounded-full p-2 hover:bg-[#081323] ">
                    <HiOutlinePhotograph className="text-[22px] x-textcolor " />
                  </div>
                  <div className="rounded-full p-2 hover:bg-[#081323]">
                    <MdOutlineGifBox className="text-[22px] x-textcolor " />
                  </div>
                  <div className="rounded-full p-2 hover:bg-[#081323]">
                    <RiListRadio className="text-[22px] x-textcolor " />
                  </div>
                  <div className="rounded-full p-2 hover:bg-[#081323]">
                    <BsEmojiSmile className="text-[22px] x-textcolor " />
                  </div>
                  <div className="rounded-full p-2 hover:bg-[#081323]">
                    <LuFolderClock className="text-[22px] x-textcolor " />
                  </div>
                  <div className="rounded-full p-2 hover:bg-[#081323]">
                    <FiMapPin className="text-[22px] x-textcolor " />
                  </div>
                </div>
                <div>
                  <button
                    onClick={handleComment}
                    className="py-2 rounded-full hidden md:inline-block x-bgcolor px-4"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
