import PostContent from "@/components/post/SinglePost/PostContent";
import { Tweet } from "@/graphql/types";
import { formatFullDate } from "@/lib/timeStamp";
import React from "react";

const PostMainContent = ({ singleTweet }: { singleTweet: Tweet }) => {
  return (
    <div>
      <div className="px-3">
        <PostContent
          author={singleTweet?.author}
          tweetId={singleTweet?.id}
          content={singleTweet?.content}
          mediaArray={singleTweet?.mediaArray}
          hashtags={singleTweet?.hashtags}
        />
      </div>
      <div className="px-4 py-2">
        <p className="gray">{formatFullDate(singleTweet?.createdAt)}</p>
      </div>
    </div>
  );
};

export default PostMainContent;
