"use client";
import React, { useEffect, useState } from "react";
import DivisionBar from "@/shared/divisionbar";
import { Comment as CommentType } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import { useGetCommentById } from "@/hooks/comment";
import { useCommentMutation } from "@/hooks/mutation/useCommentMutation";
import AuthorProfile from "@/shared/AuthorProfile";
import HoverWrapper from "@/shared/singlePost/HoverWrapper";
import AuthorDetail from "@/shared/singlePost/AuthorDetail";
import PostControlDialog from "@/shared/singlePost/postControlDialog";
import PostContent from "../post/SinglePost/PostContent";
import PostActions from "../post/SinglePost/PostActions";

const SingleComment = ({
  comment: singleComment,
}: {
  comment: CommentType;
}) => {
  const [liked, setLiked] = useState(false);
  const [repost, setRepost] = useState(false);
  const { singleComment: comment } = useGetCommentById(singleComment.id);

  const { user } = useCurrentUser();

  const { likeComment, repostComment } = useCommentMutation({});

  async function handleCommentLike() {
    setLiked((prevVal) => !prevVal);

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
    if (!comment) {
      return;
    }
    if (comment?.likes?.length !== 0 && user) {
      setLiked(comment?.likes?.some((like) => like?.userId === user.id));
    }
    if (comment?.repostComment?.length !== 0 && user) {
      setRepost(
        comment?.repostComment?.some((repost) => repost.userId === user.id)
      );
    }
  }, [comment, user]);

  if (!comment) {
    return;
  }
  return (
    <div className="w-full cursor-pointer py-3 ">
      <div className="flex gap-0 w-full relative px-4 ">
        <div className="pr-4">
          <HoverWrapper userId={comment?.author.id}>
            <AuthorProfile author={comment?.author} />
          </HoverWrapper>
        </div>
        <div className="w-full">
          <AuthorDetail
            author={comment?.author}
            createdAt={comment?.createdAt}
          />
          <PostControlDialog isComment={true} tweet={comment} />
          <div className="w-full pl-0 px-4">
            <PostContent
              author={comment?.author}
              tweetId={comment?.id}
              content={comment?.content}
              mediaArray={comment?.mediaArray}
              hashtags={comment?.hashtags}
              isComment={true}
              showMedia={true}
            />
            <PostActions
              tweet={comment}
              liked={liked}
              isComment={true}
              repost={repost}
              handleRepostTweet={handleRepostComment}
              handleTweetLike={handleCommentLike}
            />
          </div>
        </div>
      </div>
      <DivisionBar type="x" />
    </div>
  );
};

export default SingleComment;
