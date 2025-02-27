import {  usegetUserFollowingTweet } from "@/hooks/tweet";
import React from "react";
import SinglePost from "./SinglePost/singlePost";
import Loading from "@/shared/loading";

const FollowingList = () => {
    const {userFollowingTweet}=usegetUserFollowingTweet()

    if(!userFollowingTweet){
      return(
        <div className="flex justify-center py-10">
        <Loading />
      </div>
      )
    }
    if(userFollowingTweet&&!userFollowingTweet.length){
      return(
        <div className="rounded-[20px] p-4">
        <p className="text-gray-500 text-lg text-center">You’re not following anyone yet.</p>
      </div>
      )
    }

  return (
    <div className="min-h-screen">
      <div>
        {userFollowingTweet &&
          userFollowingTweet.length !== 0 &&
          userFollowingTweet.map((tweet:any) => <SinglePost tweet={tweet} key={tweet.id} />)}
      </div>
    </div>
  );
};

export default FollowingList;
