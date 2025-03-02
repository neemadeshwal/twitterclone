"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/user";

import PostInteractions from "@/shared/PostDetail/PostInteractions";
import Photos from "./Photos";
import { useCommentMutation } from "@/hooks/mutation/useCommentMutation";
import { Tweet, Comment as CommentType } from "@/graphql/types";

// Type guard functions for Tweet and Comment
const isTweetType = (tweet: Tweet | CommentType): tweet is Tweet =>
  "repostTweet" in tweet;
const isCommentType = (tweet: Tweet | CommentType): tweet is CommentType =>
  "repostComment" in tweet;

const CommentPhotos = ({
  photoNum,
  tweet,
  setShowFullPhoto,
  showFullPhoto,
  currentUrl,
  isComment: isCommentProp,
}: {
  tweet: Tweet | CommentType;
  photoNum: string;
  showFullPhoto: boolean;
  currentUrl: string;
  setShowFullPhoto: Dispatch<SetStateAction<boolean>>;
  isComment: boolean;
}) => {
  const [liked, setLiked] = useState(false);
  const [repost, setRepost] = useState(false);

  const { user } = useCurrentUser();

  const { likeComment, repostComment } = useCommentMutation({});

  async function handleRepostTweet() {
    if (!tweet || !tweet.id) {
      return;
    }
    const body = {
      commentId: tweet.id,
    };
    try {
      await repostComment(body);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleTweetLike() {
    setLiked((prevVal) => !prevVal);
    if (!tweet?.id) {
      return;
    }
    const body = {
      commentId: tweet.id,
    };
    try {
      await likeComment(body);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isCommentType(tweet)) {
      // Handle comment specific logic
      if (tweet?.likes && user) {
        setLiked(tweet.likes.some((like) => like.userId === user.id));
      }
      if (tweet?.repostComment && user) {
        setRepost(
          tweet.repostComment.some((repost) => repost.userId === user.id)
        );
      }
    } else if (isTweetType(tweet)) {
      // Handle tweet specific logic
      if (tweet?.likedBy && user) {
        setLiked(tweet.likedBy.some((like) => like.userId === user.id));
      }
      if (tweet?.repostTweet && user) {
        setRepost(
          tweet.repostTweet.some((repost) => repost.userId === user.id)
        );
      }
    }
  }, [tweet, user]);

  return (
    <div
      className={`${
        showFullPhoto ? "w-[100%]" : "w-[64%]"
      } overflow-hidden flex justify-center items-start relative`}
    >
      <Photos
        currentUrl={currentUrl}
        photoNum={photoNum}
        showFullPhoto={showFullPhoto}
        setShowFullPhoto={setShowFullPhoto}
        tweet={tweet}
      />

      <div className="fixed w-[60%] bottom-0">
        <PostInteractions
          tweet={tweet}
          liked={liked}
          repost={repost}
          isComment={isCommentProp}
          handleRepostTweet={handleRepostTweet}
          handleTweetLike={handleTweetLike}
        />
      </div>
    </div>
  );
};

export default CommentPhotos;
