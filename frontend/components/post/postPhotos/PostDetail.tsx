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
import PostAuthorInfo from "@/shared/PostDetail/PostAuthorInfo";
import PostMainContent from "@/shared/PostDetail/PostMainContent";
import PostInteractions from "@/shared/PostDetail/PostInteractions";
import CommentSection from "@/shared/PostDetail/CommentSection";

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
    if (singleTweet?.likedBy && user) {
      setLiked(
        singleTweet.likedBy.some((like: any) => like.userId === user.id)
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
        <PostAuthorInfo tweet={singleTweet} />

        <div className="px-3 pr-5 py-2"></div>
        <PostMainContent singleTweet={singleTweet} />
        <PostInteractions
          tweet={singleTweet}
          liked={liked}
          repost={repost}
          handleRepostTweet={handleRepostTweet}
          handleTweetLike={handleTweetLike}
        />
        <CommentSection user={user} tweet={singleTweet} />
      </div>
    </div>
  );
};

export default PostDetail;
