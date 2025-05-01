"use client";
import React, { useEffect, useState } from "react";

import { useGetSingleTweet } from "@/hooks/tweet";
import { usePathname } from "next/navigation";
import { authorType } from "@/graphql/types";
import Loading from "@/shared/loading";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";
import PostHeader from "@/shared/PostDetail/PostHeader";
import PostAuthorInfo from "@/shared/PostDetail/PostAuthorInfo";
import PostMainContent from "@/shared/PostDetail/PostMainContent";
import PostInteractions from "@/shared/PostDetail/PostInteractions";
import CommentSection from "@/shared/PostDetail/CommentSection";
import { toast } from "@/hooks/use-toast";

const PostDetail = ({
  user,
  postId,
}: {
  user: authorType | null;
  postId?: string;
}) => {
  const pathname = usePathname();
  const idArr = pathname.split("/");
  const id = idArr[idArr.length - 1];

  const [liked, setLiked] = useState(false);
  const { singleTweet: tweet } = useGetSingleTweet(postId ?? id);

  const [repost, setRepost] = useState(false);

  const { likeTweet, repostTweet } = useTweetMutation({});
  const [likeCount, setLikeCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);
  const [savePost, setSavePost] = useState(false);
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
      tweetId: tweet!.id,
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
      tweetId: tweet!.id,
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

  console.log(postId, "postid");

  if (!tweet) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }
  return (
    <div>
      <div>
        {!postId && <PostHeader />}
        <PostAuthorInfo tweet={tweet} />

        <div className="px-3 pr-5 py-2"></div>
        <PostMainContent
          showMedia={postId ? false : true}
          singleTweet={tweet}
        />
        <PostInteractions
          tweet={tweet}
          liked={liked}
          likedCount={likeCount}
          repostCount={repostCount}
          handleSaveTweet={handleSaveTweet}
          repost={repost}
          handleRepostTweet={handleRepostTweet}
          handleTweetLike={handleTweetLike}
          savePost={savePost}
        />
        <CommentSection user={user} tweet={tweet} />
      </div>
    </div>
  );
};

export default PostDetail;
