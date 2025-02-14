import { useAllTweet } from "@/hooks/tweet";
import React, { useEffect, useState } from "react";
import SinglePost from "@/components/post/SinglePost/singlePost";
import { getAllPostData } from "@/lib/ServerFetchApi/ServerSideFunc";
import Loading from "@/shared/loading";
import { Tweet } from "@/graphql/types";
import ScrollTop from "@/shared/ScrollTop";

const PostTab = ({searchResult,query,isLoading}:{searchResult:any,query:string,isLoading:any}) => {
  if (isLoading||!searchResult) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }
  if (searchResult&&searchResult?.post && !searchResult.post.length) {
    return (
        <div className="py-10 flex flex-col justify-center items-center">
        <h3 className="text-lg font-bold mb-4">No results for {query}</h3>
        <p className="text-gray-500 text-sm">
          Try searching for something else
        </p>
      </div>
    );
  }

  const tweetList=searchResult.post

  return (
    <div>
      <ScrollTop/>
      <div>
        {tweetList &&
          tweetList.length !== 0 &&
          tweetList.map((tweet:any) => <SinglePost tweet={tweet} key={tweet.id} />)}
      </div>
    </div>
  );
};

export default PostTab;
