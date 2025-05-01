"use client";
import React, { useEffect, useState } from "react";

import DivisionBar from "@/shared/divisionbar";
import { Tweet } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import PostActions from "./PostActions";
import AuthorDetail from "@/shared/singlePost/AuthorDetail";
import AuthorProfile from "@/shared/AuthorProfile";
import PostContent from "./PostContent";
import HoverWrapper from "@/shared/singlePost/HoverWrapper";
import PostControlDialog from "@/shared/singlePost/postControlDialog";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";
import { toast } from "@/hooks/use-toast";

const SinglePost = ({ tweet }: { tweet: Tweet }) => {
  const [liked, setLiked] = useState(false);
  const [repost, setRepost] = useState(false);
  const { user } = useCurrentUser();
  const [likeCount, setLikeCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);
  const [savePost, setSavePost] = useState(false);

  console.log(tweet, "post twweet");
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
    if (tweet.likedBy && user) {
      setLikeCount(tweet.likedBy.length);
      setLiked(tweet.likedBy.some((like) => like.userId === user.id));
    }
    if (tweet.repostTweet && user) {
      setRepostCount(tweet.repostTweet.length);
      setRepost(tweet.repostTweet.some((repost) => repost.userId === user.id));
    }
    if (tweet.savedPost && user) {
      const isSaved = tweet.savedPost?.some(
        (post) => post.tweetId === tweet.id
      );
      setSavePost(isSaved);
    }
  }, [tweet, user]);

  return (
    <div className="w-full cursor-pointer   py-3">
      <div className="flex gap-0 w-full relative px-4 ">
        <div className="pr-4">
          <HoverWrapper userId={tweet?.author?.userName}>
            <AuthorProfile author={tweet?.author} />
          </HoverWrapper>
        </div>
        <div className="w-full">
          <AuthorDetail author={tweet?.author} createdAt={tweet?.createdAt} />
          <PostControlDialog tweet={tweet} />
          <div className="w-full pl-0 px-4">
            <PostContent
              author={tweet?.author}
              tweetId={tweet?.id}
              content={tweet?.content}
              mediaArray={tweet?.mediaArray}
              hashtags={tweet?.hashtags}
              showMedia={true}
            />
            <PostActions
              tweet={tweet}
              liked={liked}
              likedCount={likeCount}
              repost={repost}
              repostCount={repostCount}
              handleRepostTweet={handleRepostTweet}
              handleTweetLike={handleTweetLike}
              savePost={savePost}
              handleSaveTweet={handleSaveTweet}
            />
          </div>
        </div>
      </div>
      <DivisionBar type="x" />
    </div>
  );
};

export default SinglePost;
