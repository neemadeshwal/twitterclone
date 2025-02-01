"use client";
import { createComment } from "@/graphql/mutation/comment";
import { getCurrentUser, Tweet } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import { formatTimeAgo, getDateTime } from "@/lib/timeStamp";
import CurrentUser from "@/shared/currentUser";
import UserProfile from "@/shared/AuthorProfile";
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
  iconColor,
}: {
  tweet: Tweet;
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
        }  text-[13px] font-[400] cursor-pointer group hover:text-blue-400  relative`}
      >
        <div className="p-2 rounded-full group-hover:bg-[#1e2034a5] ">
          <BsChat className="text-[16px] sm:text-[20px] " />
        </div>
        <p className="ml-0 pl-0 -right-[0.3rem] absolute">
          {tweet?.commentAuthor.length}
        </p>
      </div>
      {showDialogBox && (
        <div className="fixed top-0 left-0 w-full h-full z-[1000] dimBg flex items-center justify-center">
          <div className="bg-black  z-[1000] relative  md:rounded-[20px] w-full  md:w-[600px]  h-full md:h-auto md:py-6">
            <div
              onClick={() => {
                setShowDialogBox(false);
                console.log("hello check x");
              }}
              className="absolute top-2 left-2 hidden md:block rounded-full p-1 z-50 hover:bg-[#0f0f0f] cursor-pointer"
            >
              <BiX className="text-[30px] " />
            </div>

            <div
              onClick={() => setShowDialogBox(false)}
              className="absolute top-2 left-2 rounded-full p-1  md:hidden  z-50 hover:bg-[#0f0f0f] cursor-pointer"
            >
              <FaArrowLeft className="text-[20px] " strokeWidth={1} />
            </div>
            <div className="absolute top-2 md:hidden right-2 rounded-full z-50 p-1 hover:bg-[#0f0f0f] cursor-pointer">
              <button
                onClick={handleComment}
                className="py-[0.4rem] rounded-full x-bgcolor px-6"
              >
                Reply
              </button>
            </div>
            <div className="flex flex-col xs:gap-2 sm:gap-4">
              <div className="px-4">
                <div>
                  <div className="  w-full   pt-20  relative  md:pt-14   flex gap-2 ">
                    <div className="flex gap-4">
                      <div className="flex  w-fit md:items-center flex-col gap-1 h-full md:justify-center  items-center ">
                        <div className=" flex items-center  flex-col gap-2">
                          <UserProfile author={tweet?.author} />
                        </div>
                        <div className="w-[2px] rounded-full h-full block flex-grow bg-[#2c2c2cb2] "></div>
                      </div>
                      <div className="w-full">
                        <div className="flex flex-col sm:flex-row items-start sm:gap-1 sm:items-center">
                          <div className="flex items-center gap-3">
                            <p className="capitalize font-[600] text-[17px] xs:text-[20px]">
                              {tweet.author?.firstName} {tweet.author?.lastName}
                            </p>
                            <div className="hidden xs:flex items-center xs:text-[15px] sm:text-xl">
                              <p className=" gray font-[300]">
                                @{tweet.author?.userName}
                              </p>
                              <p>
                                <LuDot className="gray font-[300]" />
                              </p>

                              <p className="gray  font-[300]">
                                {formatTimeAgo(getDateTime(tweet?.createdAt))}
                              </p>
                            </div>
                          </div>
                          <div className="flex xs:hidden  items-center sm:items-start">
                            <p className=" gray text-[15px] leading-[19px] font-[400]">
                              @{tweet.author?.userName}
                            </p>

                            <p>
                              <LuDot className="gray font-[300]" />
                            </p>

                            <p className="gray text-[14px] md:text-[16px] leading-[19px] font-[300]">
                              {formatTimeAgo(getDateTime(tweet?.createdAt))}
                            </p>
                          </div>
                        </div>
                        <div className="py-1 sm:pb-6 sm:pt-2 text-[15px] xs:text-lg">
                          {tweet?.content}
                        </div>
                        <div>
                          {tweet?.hashtags && tweet?.hashtags.length !== 0 && (
                            <div>
                              {tweet?.hashtags.map((tag: any) => {
                                return (
                                  <span
                                    key={tag.id}
                                    className="x-textcolor sm:text-lg"
                                  >
                                    {tag.text}{" "}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        {tweet?.mediaArray &&
                          tweet?.mediaArray.length !== 0 && (
                            <div className="pr-4 text-[14px] xs:text-lg sm:text-[18px] flex flex-col gap-4">
                              {tweet?.mediaArray?.map((url, index) => (
                                <div key={url} className="relative break-all">
                                  {url}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex gap-4 my-2 items-center h-10 ">
                  <div className="w-[2px] mx-4 rounded-full h-full block bg-[#2c2c2cb2] "></div>

                  <div className="gray font-[500] text-[15px] xs:text-lg sm:text-xl py-1">
                    Replying to{" "}
                    <p className="x-textcolor inline">
                      @{tweet.author?.userName}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <div className="   px-4 ">
                  <div className=" w-full">
                    <div className="w-full mt-2 xs:text-lg sm:text-xl px-2 flex items-start gap-4">
                      <div className="">
                        <CurrentUser />
                      </div>
                      <textarea
                        value={tweetComment}
                        onChange={(e) => setTweetComment(e.target.value)}
                        rows={3}
                        autoFocus
                        className=" bg-transparent resize-none outline-none border-0 w-full placeholder:text-gray-600"
                        placeholder="Post your reply"
                      ></textarea>
                    </div>
                  </div>
                  <div>
                    <div className=" w-full">
                      <div className=" flex  justify-between pr-6">
                        <div className="flex gap-2 ">
                          <div className="rounded-full p-2 hover:bg-[#081323] ">
                            <HiOutlinePhotograph className="text-[22px] sm:text-[26px] x-textcolor " />
                          </div>
                          <div className="rounded-full p-2 hover:bg-[#081323]">
                            <MdOutlineGifBox className="text-[22px] sm:text-[26px] x-textcolor " />
                          </div>
                          <div className="rounded-full p-2 hover:bg-[#081323]">
                            <RiListRadio className="text-[22px] sm:text-[26px] x-textcolor " />
                          </div>
                          <div className="rounded-full p-2 hover:bg-[#081323]">
                            <BsEmojiSmile className="text-[22px] sm:text-[26px] x-textcolor " />
                          </div>
                          <div className="rounded-full p-2 hover:bg-[#081323]">
                            <LuFolderClock className="text-[22px] sm:text-[26px] x-textcolor " />
                          </div>
                          <div className="rounded-full p-2 hover:bg-[#081323]">
                            <FiMapPin className="text-[22px] sm:text-[26px] x-textcolor " />
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;
