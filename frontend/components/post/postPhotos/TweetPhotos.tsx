"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/user";

import PostInteractions from "@/shared/PostDetail/PostInteractions";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";
import Photos from "./Photos";
import { Comment, Like, Repost, Tweet } from "@/graphql/types";

const TweetPhotos = ({
  photoNum,
  tweet,
  setShowFullPhoto,
  showFullPhoto,
  currentUrl,
}: {
  photoNum: string;
  tweet: Tweet | Comment | undefined;
  setShowFullPhoto: Dispatch<SetStateAction<boolean>>;
  showFullPhoto: boolean;
  currentUrl: string;
}) => {
  const [liked, setLiked] = useState(false);
  const [repost, setRepost] = useState(false);

  const { user } = useCurrentUser();

  const { likeTweet, repostTweet } = useTweetMutation({});

  async function handleRepostTweet() {
    if (!tweet || !tweet.id) {
      return;
    }
    const body = {
      tweetId: tweet.id,
    };
    try {
      await repostTweet(body);
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
      tweetId: tweet.id,
    };
    try {
      await likeTweet(body);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (tweet?.likedBy && user) {
      setLiked(tweet.likedBy.some((like: Like) => like.userId === user.id));
    }
    if (tweet?.repostTweet && user) {
      setRepost(
        tweet.repostTweet.some((repost: Repost) => repost.userId === user.id)
      );
    }
  }, [tweet, user]);

  console.log(tweet);
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
          handleRepostTweet={handleRepostTweet}
          handleTweetLike={handleTweetLike}
        />
      </div>
    </div>
  );
};

export default TweetPhotos;
