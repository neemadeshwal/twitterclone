import React from "react";
import DivisionBar from "../divisionbar";
import PostActions from "@/components/post/SinglePost/PostActions";
import { Comment, Tweet } from "@/graphql/types";

interface PostInteractionsProps {
  tweet: Tweet | Comment;
  liked: boolean;
  repost: boolean;
  handleTweetLike: () => void;
  handleRepostTweet: () => void;
  isComment?: boolean;
  isInPhotoSection?: boolean;
  likedCount: number;
  repostCount: number;
  handleSaveComment?: () => void;
  handleSaveTweet?: () => void;
  savePost: boolean;
}
const PostInteractions = ({
  tweet,
  liked,
  repost,
  handleRepostTweet,
  handleTweetLike,
  isInPhotoSection,
  isComment,
  likedCount,
  repostCount,
  handleSaveTweet,
  handleSaveComment,
  savePost,
}: PostInteractionsProps) => {
  return (
    <div>
      <div className={`px-4 ${!isInPhotoSection ? "pt-2" : "pt-0"}`}>
        {!isInPhotoSection && <DivisionBar type="x" />}
        <PostActions
          tweet={tweet}
          liked={liked}
          repost={repost}
          likedCount={likedCount}
          handleRepostTweet={handleRepostTweet}
          repostCount={repostCount}
          handleTweetLike={handleTweetLike}
          isComment={isComment}
          handleSaveTweet={handleSaveTweet}
          handleSaveComment={handleSaveComment}
          savePost={savePost}
        />
        {!isInPhotoSection && <DivisionBar type="x" />}
      </div>
    </div>
  );
};

export default PostInteractions;
