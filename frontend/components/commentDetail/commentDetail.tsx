"use client";
import React, { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import { authorType } from "@/graphql/types";
import Loading from "@/shared/loading";
import PostHeader from "@/shared/PostDetail/PostHeader";
import PostAuthorInfo from "@/shared/PostDetail/PostAuthorInfo";
import PostMainContent from "@/shared/PostDetail/PostMainContent";
import PostInteractions from "@/shared/PostDetail/PostInteractions";
import CommentSection from "@/shared/PostDetail/CommentSection";
import { useGetCommentById } from "@/hooks/comment";
import { useCommentMutation } from "@/hooks/mutation/useCommentMutation";
import { toast } from "@/hooks/use-toast";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";

const CommentDetail = ({
  user,
  commentId,
}: {
  user: authorType | null;
  commentId?: string;
}) => {
  const pathname = usePathname();
  const idArr = pathname.split("/");
  const id = idArr[idArr.length - 1];

  const [liked, setLiked] = useState(false);
  const { singleComment } = useGetCommentById(commentId ?? id);
  const [savePost, setSavePost] = useState(false);

  const [repost, setRepost] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);
  const { likeComment, repostComment } = useCommentMutation({});

  const { saveComment } = useCommentMutation({
    onError: () => {
      // Revert the bookmark state on error
      setSavePost((prev) => !prev);
    },
  });
  useEffect(() => {
    if (!singleComment) {
      return;
    }
    if (singleComment.likes && user) {
      setLiked(singleComment.likes.some((like) => like.userId === user.id));
    }
    if (singleComment.repostComment && user) {
      setRepost(
        singleComment.repostComment.some((repost) => repost.userId === user.id)
      );
    }
  }, [singleComment, user]);

  async function handleSaveComment() {
    if (!singleComment || !singleComment.id) {
      return;
    }

    setSavePost((prevVal) => !prevVal);

    const body = {
      commentId: singleComment.id,
    };

    try {
      const response = await saveComment(body);

      if (response && response.toggleSaveComment.msg === "comment saved") {
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
  const { saveTweet } = useTweetMutation({
    onError: () => {
      // Revert the bookmark state on error
      setSavePost((prev) => !prev);
    },
  });

  async function handleSaveTweet() {
    if (!singleComment || !singleComment.id) {
      return;
    }

    setSavePost((prevVal) => !prevVal);

    const body = {
      tweetId: singleComment.id,
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
  async function handleCommentLike() {
    setLiked((prevVal) => !prevVal);

    if (liked) {
      setLikeCount((prevVal) => prevVal - 1);
    } else {
      setLikeCount((prevVal) => prevVal + 1);
    }

    if (!singleComment || !singleComment.id) {
      return;
    }
    const body = {
      commentId: singleComment.id,
    };
    try {
      await likeComment(body);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleRepostComment() {
    setRepost((prevVal) => !prevVal);
    if (repost) {
      setRepostCount((prevVal) => prevVal - 1);
    } else {
      setRepostCount((prevVal) => prevVal + 1);
    }
    if (!singleComment || !singleComment.id) {
      return;
    }
    const body = {
      commentId: singleComment.id,
    };
    try {
      await repostComment(body);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!singleComment) {
      return;
    }
    if (singleComment?.likes?.length !== 0 && user) {
      setLikeCount(singleComment.likes.length);

      setLiked(singleComment?.likes?.some((like) => like?.userId === user.id));
    }
    if (singleComment?.repostComment?.length !== 0 && user) {
      setRepostCount(singleComment.repostComment.length);

      setRepost(
        singleComment?.repostComment?.some(
          (repost) => repost.userId === user.id
        )
      );
    }
  }, [singleComment, user]);

  if (!singleComment) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }
  return (
    <div>
      <div>
        {!commentId && <PostHeader />}
        <PostAuthorInfo tweet={singleComment} />

        <div className="px-3 pr-5 py-2"></div>
        <PostMainContent
          showMedia={commentId ? false : true}
          singleTweet={singleComment}
        />
        <PostInteractions
          isComment={true}
          tweet={singleComment}
          liked={liked}
          repost={repost}
          handleRepostTweet={handleRepostComment}
          handleTweetLike={handleCommentLike}
          likedCount={likeCount}
          repostCount={repostCount}
          savePost={savePost}
          handleSaveComment={handleSaveComment}
          handleSaveTweet={handleSaveTweet}
        />
        <CommentSection
          isParentComment={true}
          isComment={true}
          user={user}
          tweet={singleComment}
        />
      </div>
    </div>
  );
};

export default CommentDetail;
