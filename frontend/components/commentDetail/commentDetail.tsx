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
import { useGetCommentById } from "@/hooks/comment";
import { useCommentMutation } from "@/hooks/mutation/useCommentMutation";

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

  const [repost, setRepost] = useState(false);

  const { likeComment, repostComment } = useCommentMutation({});

  async function handleRepostComment() {
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
  async function handleCommentLike() {
    setLiked((prevVal) => !prevVal);
    if (!singleComment?.id) {
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
