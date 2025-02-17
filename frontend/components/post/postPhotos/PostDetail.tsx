"use client";
import DivisionBar from "@/shared/divisionbar";
import PostActivity from "@/shared/postActivity";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoEllipsisHorizontal, IoShareOutline } from "react-icons/io5";
import Comment from "../comment";
import { LuRepeat2 } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import SavePost from "@/shared/savePost";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/user";
import { toggleLikeTweet } from "@/graphql/mutation/like";
import CurrentUser from "@/shared/currentUser";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlineGifBox } from "react-icons/md";
import { createCommentMutate } from "@/graphql/mutation/comment";
import SingleComment from "@/components/postDetail/singleComment";

const PostDetail = ({ tweet: singleTweet }: any) => {
  const [isPostControlDialogOpen, setPostControlDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(false);
  const [repost, setRepost] = useState(false);
  const [tweetComment, setTweetComment] = useState("");
  const { user } = useCurrentUser();
  const commentMutation = useMutation({
    mutationFn: createCommentMutate,
    onSuccess: (response: any) => {
      console.log(response);
      setTweetComment("");
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const mutation = useMutation({
    mutationFn: toggleLikeTweet,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function handleTweetLike() {
    setLiked((prevVal) => !prevVal);
    if (!singleTweet?.id) {
      return;
    }
    const body = {
      tweetId: singleTweet.id,
    };
    try {
      await mutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (singleTweet?.LikedBy && user) {
      setLiked(
        singleTweet.LikedBy.some((like: any) => like.userId === user.id)
      );
    }
    if (singleTweet?.repostTweet && user) {
      setRepost(
        singleTweet.repostTweet.some((repost: any) => repost.userId === user.id)
      );
    }
  }, [singleTweet, user]);

  return (
    <div className=" w-[34%] overflow-y-auto h-screen px-4 py-2 pr-1">
      <div>
        <div>
          <div className="flex justify-between p-2 items-center">
            <div className="flex items-center gap-1 py-2">
              <div>
                {singleTweet?.author?.profileImgUrl ? (
                  <div>
                    {singleTweet?.author?.profileImgUrl.startsWith("#") ? (
                      <div
                        style={{
                          backgroundColor: singleTweet?.author?.profileImgUrl,
                        }}
                        className="rounded-full w-10 h-10 flex items-center justify-center capitalize"
                      >
                        {singleTweet?.author?.firstName.slice(0, 1)}
                      </div>
                    ) : (
                      <Image
                        src={singleTweet?.author?.profileImgUrl}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                  </div>
                ) : (
                  <div className="rounded-full w-10 h-10 bg-blue-900 flex items-center justify-center capitalize">
                    {singleTweet?.author?.firstName.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="px-4">
                <h3 className="text-[16px] font-[600] leading-tight  capitalize">
                  {singleTweet?.author?.firstName}{" "}
                  {singleTweet?.author?.lastName}
                </h3>
                <p className="gray text-[14px] font-[400]">
                  @{singleTweet?.author?.userName}
                </p>
              </div>
            </div>
            <div
              className="relative mr-2 cursor-pointer hover:bg-[#253e703e] flex items-center justify-between p-2 rounded-full"
              onClick={() => setPostControlDialogOpen(true)}
            >
              <IoEllipsisHorizontal className="gray hover:text-blue-400  " />
              {isPostControlDialogOpen && (
                <PostActivity
                  singleTweet={singleTweet}
                  setPostControlDialogOpen={setPostControlDialogOpen}
                />
              )}
            </div>
          </div>

          <div className="text-white">{singleTweet?.content}</div>

          {singleTweet?.hashtags?.length !== 0 && (
            <div className="mt-2">
              {singleTweet?.hashtags?.map((item: any) => {
                return (
                  <span key={item.id} className="x-textcolor ">
                    {item.text}{" "}
                  </span>
                );
              })}
            </div>
          )}
          <div className="px-4 py-2">
            <p className="gray">
              5:48 PM · Nov 1, 2024 · <span className="text-white">3.1M</span>{" "}
              Views
            </p>
          </div>
        </div>
        <DivisionBar type="x" />
        <div>
          <div className="flex justify-between py-2 pt-3 pb-4">
            <Comment tweet={singleTweet} />
            <div className="flex gap-1 items-center cursor-pointer gray text-[13px] font-[400]">
              {repost ? (
                <LuRepeat2 className="text-[20px] text-[#00ba7c] " />
              ) : (
                <LuRepeat2 className="text-[20px] " />
              )}
              <p className={`${repost ? "text-[#00ba7c]" : "gray"}`}>
                {singleTweet?.repostTweet.length}
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
              <p className={`${liked ? "text-red-500" : "gray"}`}>
                {singleTweet?.LikedBy?.length}
              </p>
            </div>
            <div className="flex gap-1 items-center gray text-[13px] font-[400]">
              <IoShareOutline className="text-[20px] " />
            </div>
            <SavePost singleTweet={singleTweet} />
          </div>
        </div>
        <DivisionBar type="x" />
        <div className="py-2  w-full">
          <div className="w-full  px-2 flex gap-3 py-4">
            <div className="">
              <CurrentUser user={user} />
            </div>
            <div className="w-full flex items-start gap-2  ">
              <div className="gray font-[500] text-[14px] "></div>
              <textarea
                value={tweetComment}
                onChange={(e) => setTweetComment(e.target.value)}
                rows={2}
                autoFocus
                className="text-[20px] bg-transparent resize-none outline-none border-0 w-full placeholder:text-gray-600"
                placeholder="Post your reply"
              ></textarea>

              <div className="flex items-center justify-center">
                <button className="py-2 rounded-full x-bgcolor px-4">
                  Reply
                </button>
              </div>
            </div>
            <div className="py-3">
              <DivisionBar type="x" />
            </div>
          </div>
          <div>
            <DivisionBar type="x" />
            {singleTweet?.commentAuthor.map((item: any) => {
              return <SingleComment key={item.id} comment={item} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
