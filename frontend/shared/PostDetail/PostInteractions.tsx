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
}
const PostInteractions = ({
  tweet,
  liked,
  repost,
  handleRepostTweet,
  handleTweetLike,
  isInPhotoSection,
  isComment,
}: PostInteractionsProps) => {
  return (
    <div>
      <div className={`px-4 ${!isInPhotoSection ? "pt-2" : "pt-0"}`}>
        {!isInPhotoSection && <DivisionBar type="x" />}
        <PostActions
          tweet={tweet}
          liked={liked}
          repost={repost}
          handleRepostTweet={handleRepostTweet}
          handleTweetLike={handleTweetLike}
          isComment={isComment}
        />
        {!isInPhotoSection && <DivisionBar type="x" />}
      </div>
    </div>
  );
};

export default PostInteractions;
