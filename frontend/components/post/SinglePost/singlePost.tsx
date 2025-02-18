"use client";
import React, { useEffect, useState, memo, use } from "react";

import DivisionBar from "@/shared/divisionbar";
import { Tweet } from "@/graphql/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentUser, useGetUserById } from "@/hooks/user";
import { useRouter } from "next/navigation";
import PostActions from "./PostActions";
import AuthorDetail from "@/shared/singlePost/AuthorDetail";
import AuthorProfile from "@/shared/AuthorProfile";
import PostContent from "./PostContent";
import HoverWrapper from "@/shared/singlePost/HoverWrapper";
import PostControlDialog from "@/shared/singlePost/postControlDialog";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";

const SinglePost = memo(({ tweet }: { tweet: Tweet }) => {
  const [liked, setLiked] = useState(false);
  const [repost, setRepost] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ["all-tweet"] });
  }, []);

  const { repostTweet, likeTweet } = useTweetMutation();

  async function handleRepostTweet() {
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
    if (tweet.LikedBy && user) {
      setLiked(tweet.LikedBy.some((like) => like.userId === user.id));
    }
    if (tweet.repostTweet && user) {
      setRepost(tweet.repostTweet.some((repost) => repost.userId === user.id));
    }
  }, [tweet, user]);

  return (
    <div className="w-full cursor-pointer  py-3">
      <div className="flex gap-0 w-full relative px-4 ">
        <div className="pr-4">
          <HoverWrapper userId={tweet?.author.id}>
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
              repost={repost}
              handleRepostTweet={handleRepostTweet}
              handleTweetLike={handleTweetLike}
            />
          </div>
        </div>
      </div>
      <DivisionBar type="x" />
    </div>
  );
});

export default SinglePost;
