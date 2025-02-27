import { useAllTweet } from "@/hooks/tweet";
import React from "react";
import SinglePost from "./SinglePost/singlePost";
import Loading from "@/shared/loading";

const PostList = () => {
  const { allTweet,isLoading } = useAllTweet();


  if(isLoading){
    return(
      <div className="flex items-center justify-center py-8">
      <Loading/>
  
      </div>
    )
   

  }
  if(!allTweet?.length){
    return(
      <div className="rounded-[20px] p-4">
      <p className="text-gray-500 text-lg text-center">Be the first to post!</p>
    </div>
    )
  }
  return (
    <div className="min-h-screen">
      <div>
        {allTweet &&
          allTweet.length !== 0 &&
          allTweet.map((tweet) => <SinglePost tweet={tweet} key={tweet.id} />)}
      </div>
    </div>
  );
};

export default PostList;
