"use client";
import DivisionBar from "@/shared/divisionbar";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoEllipsisHorizontal } from "react-icons/io5";

import { useGetSingleTweet } from "@/hooks/tweet";
import { usePathname } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeTweet } from "@/graphql/mutation/like";
import SingleComment from "./singleComment";
import PostActivity from "@/shared/postActivity";
import { repostTweet } from "@/graphql/mutation/repost";
import HoverWrapper from "@/shared/singlePost/HoverWrapper";
import AuthorProfile from "@/shared/AuthorProfile";
import PostContent from "../post/SinglePost/PostContent";
import PostActions from "../post/SinglePost/PostActions";
import ComposePost from "../post/compostPost";
import { authorType } from "@/graphql/types";
import Loading from "@/shared/loading";
import { formatFullDate } from "@/lib/timeStamp";
import PostControlDialog from "@/shared/singlePost/postControlDialog";

const PostDetail = ({ user }: { user: authorType | null }) => {
  const pathname = usePathname();
  const [isPostControlDialogOpen, setPostControlDialogOpen] = useState(false);
  console.log(pathname);
  const idArr = pathname.split("/");
  const id = idArr[idArr.length - 1];
  const [liked, setLiked] = useState(false);
  const { singleTweet } = useGetSingleTweet(id);
  const [repost, setRepost] = useState(false);

  const queryClient = useQueryClient();

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

  if (!singleTweet) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
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
        <div className="flex justify-between p-2 items-start">
          <div className="flex items-start gap-1 w-full py-2 relative">
            <div className="pr-4">
              <HoverWrapper userId={singleTweet?.author.id}>
                <AuthorProfile author={singleTweet?.author} />
              </HoverWrapper>
            </div>
            <div className="">
              <HoverWrapper userId={singleTweet.author?.id}>
                <div className=" gap-1  flex-col flex">
                  <p className="capitalize font-[600] md:text-[17px] hover:underline text-[15px] leading-[20px]">
                    {singleTweet.author?.firstName}{" "}
                    {singleTweet.author?.lastName}
                  </p>
                  <p className="hidden xs:inline-block gray font-[300]">
                    @{singleTweet.author?.userName}
                  </p>
                </div>
              </HoverWrapper>
            </div>
           

          </div>
          <div className="relative mt-4">
          <PostControlDialog tweet={singleTweet} />

            </div>

        </div>
        <div className="px-3 pr-5 py-2"></div>
        <div className="px-3">
          <PostContent
            author={singleTweet?.author}
            tweetId={singleTweet?.id}
            content={singleTweet?.content}
            mediaArray={singleTweet?.mediaArray}
            hashtags={singleTweet?.hashtags}
          />
        </div>
        <div className="px-4 py-2">
          <p className="gray">{formatFullDate(singleTweet?.createdAt)}</p>
        </div>
        <div className="px-4 pt-2">
          <DivisionBar type="x" />
          <PostActions
            tweet={singleTweet}
            liked={liked}
            repost={repost}
            handleRepostTweet={handleRepostTweet}
            handleTweetLike={handleTweetLike}
          />
          <DivisionBar type="x" />
        </div>
        <div className="">
          <div className="py-2  w-full">
            <div className="w-full  ">
              <div className="w-full  ">
                <div className="gray font-[500] text-[14px] px-16 ">
                  Replying to{" "}
                  <p className="x-textcolor inline">
                    @{singleTweet?.author?.userName}
                  </p>
                </div>
                <ComposePost
                  isComment={true}
                  user={user}
                  tweetId={singleTweet.id}
                />
              </div>
            </div>
          </div>
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
