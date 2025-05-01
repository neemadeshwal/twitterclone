"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/user";

import PostInteractions from "@/shared/PostDetail/PostInteractions";
import Photos from "./Photos";
import { Tweet, Comment as CommentType } from "@/graphql/types";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";
import { toast } from "@/hooks/use-toast";

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
  const [likeCount, setLikeCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);
  const [savePost, setSavePost] = useState(false);
  const { user } = useCurrentUser();

  const { repostTweet, likeTweet } = useTweetMutation();

  const { saveTweet } = useTweetMutation({
    onError: () => {
      // Revert the bookmark state on error
      setSavePost((prev) => !prev);
    },
  });

  async function handleSaveTweet() {
    if (!tweet || !tweet.id) {
      return;
    }

    setSavePost((prevVal) => !prevVal);

    const body = {
      tweetId: tweet.id,
    };

    try {
      const response = await saveTweet(body);
      console.log(response, "response");
      if (response && response.toggleSaveTweet.msg === "tweet saved") {
        toast({
          description: (
            <div className="flex items-center  justify-between w-full">
              Added to bookmarks
            </div>
          ),
          className:
            "bg-blue-500 text-[16px] font-[500] text-white border bottom-0 sm:bottom-0 md:bottom-0 border-gray-700 rounded-[10px] shadow-[0 -0.4px 0px rgba(255,255,255,0.5)]",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRepostTweet() {
    const body = {
      tweetId: tweet.id,
    };
    try {
      setRepost((prevVal) => !prevVal);

      if (repost) {
        setRepostCount((prevVal) => prevVal - 1);
      } else {
        setRepostCount((prevVal) => prevVal + 1);
      }
      await repostTweet(body);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to repost this post.Please try again.",
      });
    }
  }

  async function handleTweetLike() {
    setLiked((prevVal) => !prevVal);
    if (liked) {
      setLikeCount((prevVal) => prevVal - 1);
    } else {
      setLikeCount((prevVal) => prevVal + 1);
    }

    const body = {
      tweetId: tweet.id,
    };
    try {
      await likeTweet(body);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to like this post.Please try again.",
      });
    }
  }

  useEffect(() => {
    if (!tweet) return;

    if (isCommentType(tweet)) {
      // Handle comment likes
      if (tweet.likes && user) {
        setLikeCount(tweet.likes.length);
        setLiked(tweet.likes.some((like) => like.userId === user.id));
      }
    } else if (isTweetType(tweet)) {
      // Handle tweet likes
      if (tweet.likedBy && user) {
        setLikeCount(tweet.likedBy.length);
        setLiked(tweet.likedBy.some((like) => like.userId === user.id));
      }

      // Handle tweet reposts
      if (tweet.repostTweet && user) {
        setRepostCount(tweet.repostTweet.length);
        setRepost(
          tweet.repostTweet.some((repost) => repost.userId === user.id)
        );
      }

      // Handle saved posts
      if (tweet.savedPost && user) {
        const isSaved = tweet.savedPost.some(
          (post) => post.tweetId === tweet.id
        );
        setSavePost(isSaved);
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
          likedCount={likeCount}
          repostCount={repostCount}
          savePost={savePost}
          handleSaveTweet={handleSaveTweet}
        />
      </div>
    </div>
  );
};

export default CommentPhotos;
