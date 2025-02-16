import React from "react";
import DivisionBar from "../divisionbar";
import PostActions from "@/components/post/SinglePost/PostActions";

interface PostInteractionsProps {
  tweet: any;
  liked: boolean;
  repost: boolean;
  handleTweetLike: () => void;
  handleRepostTweet: () => void;
}
const PostInteractions = ({
  tweet,
  liked,
  repost,
  handleRepostTweet,
  handleTweetLike,
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
        />
        <DivisionBar type="x" />
      </div>
    </div>
  );
};

export default PostInteractions;
