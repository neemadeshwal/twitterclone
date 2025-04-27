"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/user";
import PostInteractions from "@/shared/PostDetail/PostInteractions";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";
import Photos from "./Photos";
import { Comment, Like, Repost, Tweet } from "@/graphql/types";
import { toast } from "@/hooks/use-toast";

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
  const [likeCount, setLikeCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);
  const [savePost, setSavePost] = useState(false);
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
  // Like handling function

  // UseEffect hook for managing like and repost state
  useEffect(() => {
    if (isTweet(tweet)) {
      // Logic specific to Tweet

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
      if (tweet.savedPost && user) {
        const isSaved = tweet.savedPost.some(
          (post) => post.tweetId === tweet.id
        );
        setSavePost(isSaved);
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
          likedCount={likeCount}
          repostCount={repostCount}
          savePost={savePost}
          handleSaveTweet={handleSaveTweet}
        />
      </div>
    </div>
  );
};

export default TweetPhotos;
