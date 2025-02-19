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
  const { singleTweet } = useGetSingleTweet(postId ?? id);

  const [repost, setRepost] = useState(false);

  const { likeTweet, repostTweet } = useTweetMutation({});

  async function handleRepostTweet() {
    if (!singleTweet || !singleTweet.id) {
      return;
    }
    const body = {
      tweetId: singleTweet.id,
    };
    try {
      await repostTweet(body);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleTweetLike() {
    setLiked((prevVal) => !prevVal);
    if (!singleTweet?.id) {
      return;
    }
    const body = {
      tweetId: singleTweet.id,
    };
    try {
      await likeTweet(body);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (!singleTweet) {
      return;
    }
    if (singleTweet.likedBy && user) {
      setLiked(singleTweet.likedBy.some((like) => like.userId === user.id));
    }
    if (singleTweet.repostTweet && user) {
      setRepost(
        singleTweet.repostTweet.some((repost) => repost.userId === user.id)
      );
    }
  }, [singleTweet, user]);

  console.log(postId, "postid");

  if (!singleTweet) {
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
        <PostAuthorInfo tweet={singleTweet} />

        <div className="px-3 pr-5 py-2"></div>
        <PostMainContent
          showMedia={postId ? false : true}
          singleTweet={singleTweet}
        />
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
