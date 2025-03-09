"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/user";
import PostInteractions from "@/shared/PostDetail/PostInteractions";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";
import Photos from "./Photos";
import { Comment, Like, Repost, Tweet } from "@/graphql/types";

// Type guard functions for Tweet and Comment

const isTweet = (tweet: Tweet | Comment): tweet is Tweet =>
  tweet !== undefined && tweet !== null && "repostTweet" in tweet;

const isComment = (tweet: Tweet | Comment): tweet is Comment =>
  tweet !== undefined && tweet !== null && "repostComment" in tweet;

const TweetPhotos = ({
  photoNum,
  tweet,
  setShowFullPhoto,
  showFullPhoto,
  currentUrl,
}: {
  photoNum: string;
  tweet: Tweet | Comment;
  setShowFullPhoto: Dispatch<SetStateAction<boolean>>;
  showFullPhoto: boolean;
  currentUrl: string;
}) => {
  const [liked, setLiked] = useState(false);
  const [repost, setRepost] = useState(false);

  const { user } = useCurrentUser();

  const { likeTweet, repostTweet } = useTweetMutation({});

  // Repost handling function
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

  // Like handling function
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

  // UseEffect hook for managing like and repost state
  useEffect(() => {
    if (isTweet(tweet)) {
      // Logic specific to Tweet
      if (tweet?.likedBy && user) {
        setLiked(tweet.likedBy.some((like: Like) => like.userId === user.id));
      }
      if (tweet?.repostTweet && user) {
        setRepost(
          tweet.repostTweet.some((repost: Repost) => repost.userId === user.id)
        );
      }
    } else if (isComment(tweet)) {
      // Logic specific to Comment
      if (tweet?.likes && user) {
        setLiked(tweet.likes.some((like: Like) => like.userId === user.id));
      }
      if (tweet?.repostComment && user) {
        setRepost(
          tweet.repostComment.some(
            (repost: Repost) => repost.userId === user.id
          )
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
          handleRepostTweet={handleRepostTweet}
          handleTweetLike={handleTweetLike}
        />
      </div>
    </div>
  );
};

export default TweetPhotos;
