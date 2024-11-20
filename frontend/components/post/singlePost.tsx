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
import PostActivity from "@/shared/postActivity";
import { repostTweet } from "@/graphql/mutation/repost";
import { io } from "socket.io-client";
import { useSocket } from "@/context/socketContext";
import SharePost from "@/shared/sharePost";

const SinglePost = ({ tweet }: { tweet: Tweet }) => {
  const [liked, setLiked] = useState(false);
  const [repost, setRepost] = useState(false);
  const [isPostControlDialogOpen, setPostControlDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useCurrentUser();
  const socket = useSocket();
  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ["all-tweet"] });
  }, []);

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
  useEffect(() => {
    if (!socket) return;

    socket.on("likeTweet", (data) => {
      console.log("just checning teh data");
      if (data.tweetId === tweet.id) {
        console.log(data.message); // Notify user when the tweet is liked (real-time)
      }
    });

    return () => {
      if (socket) socket.off("tweetLiked");
    };
  }, [socket, tweet.id]);
  const repostMutation = useMutation({
    mutationFn: repostTweet,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["all-tweet"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function handleRepostTweet() {
    const body = {
      tweetId: tweet.id,
    };
    try {
      await repostMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }
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
    if (tweet.repostTweet && user) {
      setRepost(tweet.repostTweet.some((repost) => repost.userId === user.id));
    }
  }, [tweet, user]);

  const handlePostClick = (id: string) => {
    router.push(`/${tweet.author.userName}/status/${id}`);
  };
  console.log(tweet.author, "twwet-author");

  return (
    <div className="w-full cursor-pointer py-3 ">
      <div className="flex gap-4 w-full px-2">
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
                  alt="style one"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10"
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
            <div
              className="relative"
              onClick={() => setPostControlDialogOpen(true)}
            >
              <IoEllipsisHorizontal className="gray" />
              {isPostControlDialogOpen && (
                <PostActivity
                  singleTweet={tweet}
                  setPostControlDialogOpen={setPostControlDialogOpen}
                />
              )}
              {/* <div
                style={{
                  boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
                }}
                className="absolute p-4 right-0 top-0 z-[100] w-[350px] h-[380px] bg-black rounded-[15px]"
              >
                hello
              </div> */}
            </div>
          </div>
          <div onClick={() => handlePostClick(tweet.id)}>
            {tweet?.content}

            {tweet?.hashtags?.length !== 0 && (
              <div className="mt-2">
                {tweet?.hashtags?.map((item) => {
                  return (
                    <span key={item.id} className="x-textcolor ">
                      {item.text}{" "}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          {(tweet?.photoArray?.length !== 0 ||
            tweet?.videoArray?.length !== 0) && (
            <div
              onClick={() => handlePostClick(tweet.id)}
              className={`my-2 grid w-full border border-gray-600 z-50 overflow-hidden rounded-[20px] gap-x-[2px] gap-y-[2px] grid-flow-row ${
                tweet?.photoArray?.length + tweet?.videoArray?.length > 2
                  ? "grid-cols-2 h-[500px]"
                  : tweet?.photoArray?.length + tweet?.videoArray?.length === 2
                  ? "grid-cols-2 h-[350px] gap-x-[2px]"
                  : "grid-cols-1 h-[500px]"
              }`}
            >
              {tweet?.photoArray?.length !== 0 &&
                tweet?.photoArray.map((url) => (
                  <div key={url} className="relative overflow-hidden">
                    <Image
                      src={url}
                      alt=""
                      width={400}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}

              {tweet?.videoArray?.length !== 0 &&
                tweet?.videoArray.map((url) => (
                  <div key={url} className="relative overflow-hidden">
                    <video
                      controls
                      loop
                      autoPlay
                      className="w-full h-full object-cover"
                      muted
                    >
                      <source src={url} type="video/mp4" />
                    </video>
                  </div>
                ))}
            </div>
          )}

          {/* <div onClick={() => handlePostClick(tweet.id)}>{tweet?.content}</div>
          {(tweet?.photoArray?.length !== 0 ||
            tweet?.videoArray?.length !== 0) && (
            <div
              onClick={() => handlePostClick(tweet.id)}
              className={`my-2 py-2 grid w-full   border border-gray-600 z-50 overflow-cover rounded-[20px]  gap-x-[1.6rem] gap-y-[1.50rem] grid-flow-row ${
                tweet?.photoArray?.length + tweet?.videoArray?.length > 2
                  ? "h-[500px] grid-cols-2"
                  : tweet?.photoArray?.length + tweet?.videoArray?.length == 2
                  ? "grid-cols-2 h-[350px] gap-x-[14px]"
                  : "grid-cols-1 h-[500px]"
              }  `}
            >
              {tweet?.photoArray.length !== 0 &&
                tweet?.photoArray.map((url) => {
                  return (
                    <div
                      key={url}
                      className={` flex items-center justify-center ${
                        tweet?.photoArray?.length + tweet?.videoArray?.length >
                        2
                          ? " scale-110 h-[80%]"
                          : tweet?.photoArray?.length +
                              tweet?.videoArray?.length ==
                            2
                          ? " scale-105 h-[80%]"
                          : "scale-105 w-full h-full"
                      }`}
                    >
                      <Image
                        src={url}
                        alt=""
                        width={400}
                        height={500}
                        className={`w-full  h-full`}
                      />
                    </div>
                  );
                })}
              {tweet?.videoArray.length !== 0 &&
                tweet?.videoArray.map((url) => {
                  return (
                    <div
                      key={url}
                      className={` ${
                        tweet?.photoArray?.length + tweet?.videoArray?.length >
                        2
                          ? "h-[200px] scale-110"
                          : "h-[400px] scale-105"
                      }`}
                    >
                      <video
                        controls
                        width="250"
                        height="250"
                        loop
                        autoPlay
                        className="w-full h-full"
                        muted
                      />
                      <source src={url} type="video/mp4" />
                    </div>
                  );
                })}
            </div>
          )} */}
          <div className="flex justify-between py-2 pt-3 pb-4">
            <Comment tweet={tweet} user={user!} />
            <div
              onClick={handleRepostTweet}
              className="flex gap-1 items-center gray text-[13px] font-[400]"
            >
              {repost ? (
                <LuRepeat2 className="text-[20px] text-[#00ba7c] " />
              ) : (
                <LuRepeat2 className="text-[20px] " />
              )}
              <p className={`${repost ? "text-[#00ba7c]" : "gray"}`}>
                {tweet?.repostTweet.length}
              </p>
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
              <p className={liked ? "text-red-500" : "gray"}>
                {tweet?.LikedBy.length}
              </p>
            </div>
            <SharePost
              link={`http://localhost:5000/${tweet.author.userName}/status/${tweet.id}`}
            />
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
