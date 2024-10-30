import { useAllTweet } from "@/hooks/tweet";
import React from "react";
import SinglePost from "./singlePost";

const PostList = () => {
  const { allTweet } = useAllTweet();

  return (
    <div>
      <div>
        {allTweet &&
          allTweet.length !== 0 &&
          allTweet.map((tweet) => <SinglePost tweet={tweet} key={tweet.id} />)}
      </div>
    </div>
  );
};

export default PostList;
