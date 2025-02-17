import React from "react";
import DivisionBar from "../divisionbar";
import PostActions from "@/components/post/SinglePost/PostActions";
import { Comment, Tweet } from "@/graphql/types";

interface PostInteractionsProps {
  tweet: Tweet|Comment;
  liked: boolean;
  repost: boolean;
  handleTweetLike: () => void;
  handleRepostTweet: () => void;
  isComment?:boolean
}
const PostInteractions = ({
  tweet,
  liked,
  repost,
  handleRepostTweet,
  handleTweetLike,
  isComment
}: PostInteractionsProps) => {
  return (
    <div>
      <div className="px-4 pt-2">
        <DivisionBar type="x" />
        <PostActions
          tweet={tweet}
          liked={liked}
          repost={repost}
          handleRepostTweet={handleRepostTweet}
          handleTweetLike={handleTweetLike}
          isComment={isComment}
          
        />
        <DivisionBar type="x" />
      </div>
    </div>
  );
};

export default PostInteractions;
