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
import { toast } from "@/hooks/use-toast";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";

const SingleComment = ({
  comment: singleComment,
}: {
  comment: CommentType;
}) => {
  const [liked, setLiked] = useState(false);
  const [repost, setRepost] = useState(false);
  const [savePost, setSavePost] = useState(false);

  const [likeCount, setLikeCount] = useState(0);
  const [repostCount, setRepostCount] = useState(0);
  const { singleComment: comment } = useGetCommentById(singleComment.id);

  const { user } = useCurrentUser();
  const { saveTweet } = useTweetMutation({
    onError: () => {
      // Revert the bookmark state on error
      setSavePost((prev) => !prev);
    },
  });

  async function handleSaveTweet() {
    if (!comment || !comment.id) {
      return;
    }

    setSavePost((prevVal) => !prevVal);

    const body = {
      tweetId: comment.id,
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
  const { likeComment, repostComment } = useCommentMutation({});
  const { saveComment } = useCommentMutation({
    onError: () => {
      // Revert the bookmark state on error
      setSavePost((prev) => !prev);
    },
  });
  async function handleSaveComment() {
    if (!comment || !comment.id) {
      return;
    }

    setSavePost((prevVal) => !prevVal);

    const body = {
      commentId: comment.id,
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
    if (!comment) {
      return;
    }
    if (comment?.likes?.length !== 0 && user) {
      setLikeCount(comment.likes.length);

      setLiked(comment?.likes?.some((like) => like?.userId === user.id));
    }
    if (comment?.repostComment?.length !== 0 && user) {
      setRepostCount(comment.repostComment.length);

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
              savePost={savePost}
              handleSaveComment={handleSaveComment}
              handleSaveTweet={handleSaveTweet}
              likedCount={likeCount}
              repostCount={repostCount}
            />
          </div>
        </div>
      </div>
      <DivisionBar type="x" />
    </div>
  );
};

export default SingleComment;
