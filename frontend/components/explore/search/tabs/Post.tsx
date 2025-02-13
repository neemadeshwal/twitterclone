import { useAllTweet } from "@/hooks/tweet";
import React, { useEffect, useState } from "react";
import SinglePost from "@/components/post/SinglePost/singlePost";
import { getAllPostData } from "@/lib/ServerFetchApi/ServerSideFunc";
import Loading from "@/shared/loading";
import { Tweet } from "@/graphql/types";

const PostTab = ({allTweet,query}:{allTweet:Tweet[],query:string}) => {
  if (!allTweet) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }
  if (allTweet && !allTweet.length) {
    return (
        <div className="py-10 flex flex-col justify-center items-center">
        <h3 className="text-lg font-bold mb-4">No results for {query}</h3>
        <p className="text-gray-500 text-sm">
          Try searching for something else
        </p>
      </div>
    );
  }

  const tweetList = allTweet.sort(
    (a, b) => b.LikedBy.length - a.LikedBy.length
  );

  return (
    <div>
      <div>
        {tweetList &&
          tweetList.length !== 0 &&
          tweetList.map((tweet) => <SinglePost tweet={tweet} key={tweet.id} />)}
      </div>
    </div>
  );
};

export default PostTab;
