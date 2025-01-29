"use client";
import DivisionBar from "@/shared/divisionbar";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CiBookmark, CiHeart } from "react-icons/ci";
import { FaArrowLeft, FaHeart } from "react-icons/fa";
import { IoEllipsisHorizontal, IoShareOutline } from "react-icons/io5";
import { LuFolderClock, LuRepeat2 } from "react-icons/lu";
import Comment from "../post/comment";
import { FiMapPin } from "react-icons/fi";
import { BsEmojiSmile } from "react-icons/bs";
import { RiListRadio } from "react-icons/ri";
import { MdOutlineGifBox } from "react-icons/md";
import { HiOutlinePhotograph } from "react-icons/hi";
import { useGetSingleTweet } from "@/hooks/tweet";
import { usePathname } from "next/navigation";
import { getRandomDarkHexColor } from "@/lib/randomColor";
import { useCurrentUser } from "@/hooks/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeTweet } from "@/graphql/mutation/like";
import CurrentUser from "@/shared/currentUser";
import SinglePost from "../post/singlePost";
import SingleComment from "./singleComment";
import { createComment } from "@/graphql/mutation/comment";
import PostActivity from "@/shared/postActivity";
import { repostTweet } from "@/graphql/mutation/repost";
import SavePost from "@/shared/savePost";

const PostDetail = () => {
  const pathname = usePathname();
  const [isPostControlDialogOpen, setPostControlDialogOpen] = useState(false);
  console.log(pathname);
  const idArr = pathname.split("/");
  const id = idArr[idArr.length - 1];
  const [liked, setLiked] = useState(false);
  const { singleTweet } = useGetSingleTweet(id);
  const [repost, setRepost] = useState(false);
  console.log(singleTweet, "singletweet");

  const [color, setColor] = useState("");
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  const [tweetComment, setTweetComment] = useState("");

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
  const commentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (response: any) => {
      console.log(response);
      setTweetComment("");
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const repostMutation = useMutation({
    mutationFn: repostTweet,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  async function handleRepostTweet() {
    if (!singleTweet || !singleTweet.id) {
      return;
    }
    const body = {
      tweetId: singleTweet.id,
    };
    try {
      await repostMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }
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
    if (!singleTweet) {
      return;
    }
    if (singleTweet.LikedBy && user) {
      setLiked(singleTweet.LikedBy.some((like) => like.userId === user.id));
    }
    if (singleTweet.repostTweet && user) {
      setRepost(
        singleTweet.repostTweet.some((repost) => repost.userId === user.id)
      );
    }
  }, [singleTweet, user]);
  useEffect(() => {
    setColor(getRandomDarkHexColor());
  }, []);

  async function handleReplyComment() {
    if (!singleTweet || !singleTweet.id) {
      return;
    }
    const body = {
      comment: tweetComment,
      tweetId: singleTweet!.id,
      mediaArray: [],
    };

    try {
      await commentMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }

  if (!singleTweet) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <div>
        <div className="sticky top-0 z-50 backdrop-blur-sm py-1 px-4 bg-black/60">
          <div className="flex gap-9 items-center w-full">
            <div>
              <FaArrowLeft />
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <h2 className="font-[600] text-[18px] capitalize">Post</h2>
              <button className="text-[14px] capitalize border border-white rounded-full px-4 py-1">
                reply
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-between p-2 items-center">
          <div className="flex items-center gap-1 py-2">
            <div>
              {singleTweet.author?.profileImgUrl ? (
                <div>
                  {singleTweet.author?.profileImgUrl.startsWith("#") ? (
                    <div
                      style={{
                        backgroundColor: singleTweet.author?.profileImgUrl,
                      }}
                      className="rounded-full w-10 h-10 flex items-center justify-center capitalize"
                    >
                      {singleTweet.author?.firstName.slice(0, 1)}
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
                  {singleTweet.author?.firstName.slice(0, 1)}
                </div>
              )}
            </div>
            <div className="px-4">
              <h3 className="text-[16px] font-[600] leading-tight  capitalize">
                {singleTweet.author?.firstName} {singleTweet.author?.lastName}
              </h3>
              <p className="gray text-[14px] font-[400]">
                @{singleTweet.author?.userName}
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
        <div className="px-3 pr-5 py-2"></div>
        <div className="px-3">
          <div>{singleTweet?.content}</div>
        
        </div>
        <div className="px-4 py-2">
          <p className="gray">
            5:48 PM · Nov 1, 2024 · <span className="text-white">3.1M</span>{" "}
            Views
          </p>
        </div>
        <div className="px-4 pt-2">
          <DivisionBar type="x" />
          <div>
            <div className="flex justify-between py-2 pt-3 pb-4">
              <Comment tweet={singleTweet} user={user!} />
              <div
                onClick={handleRepostTweet}
                className="flex gap-1 items-center cursor-pointer gray text-[13px] font-[400]"
              >
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
                  {singleTweet.LikedBy.length}
                </p>
              </div>
              <div className="flex gap-1 items-center gray text-[13px] font-[400]">
                <IoShareOutline className="text-[20px] " />
              </div>
              <SavePost singleTweet={singleTweet} user={user} />
            </div>
          </div>
          <DivisionBar type="x" />
        </div>
        <div className="px-4">
          <div className="py-2  w-full">
            <div className="w-full  px-2 flex gap-3 ">
              <div className="mt-6">
                <CurrentUser />
              </div>
              <div className="w-full flex flex-col gap-2  ">
                <div className="gray font-[500] text-[14px] ">
                  Replying to{" "}
                  <p className="x-textcolor inline">
                    @{singleTweet?.author?.userName}
                  </p>
                </div>
                <textarea
                  value={tweetComment}
                  onChange={(e) => setTweetComment(e.target.value)}
                  rows={2}
                  autoFocus
                  className="text-[20px] bg-transparent resize-none outline-none border-0 w-full placeholder:text-gray-600"
                  placeholder="Post your reply"
                ></textarea>
                <div className="flex justify-between w-full ">
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
                  <div className="">
                    <button
                      onClick={handleReplyComment}
                      className="py-2 rounded-full x-bgcolor px-4"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-3">
          <DivisionBar type="x" />
        </div>
        <div>
          {singleTweet.commentAuthor.map((item) => {
            return <SingleComment key={item.id} comment={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
