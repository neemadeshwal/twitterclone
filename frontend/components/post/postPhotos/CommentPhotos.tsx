"use client";
import React, { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/user";

import PostInteractions from "@/shared/PostDetail/PostInteractions";
import Photos from "./Photos";
import { useCommentMutation } from "@/hooks/mutation/useCommentMutation";

const CommentPhotos = ({
  photoNum,
  tweet,
  setShowFullPhoto,
  showFullPhoto,
  currentUrl,
  isComment,
}: any) => {
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
    if (tweet?.likedBy && user) {
      setLiked(tweet.likedBy.some((like: any) => like.userId === user.id));
    }
    if (tweet?.repostTweet && user) {
      setRepost(
        tweet.repostTweet.some((repost: any) => repost.userId === user.id)
      );
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
          isComment={isComment}
          handleRepostTweet={handleRepostTweet}
          handleTweetLike={handleTweetLike}
        />
      </div>
    </div>
  );
};

export default CommentPhotos;
