import {  usegetUserFollowingTweet } from "@/hooks/tweet";
import React from "react";
import SinglePost from "./SinglePost/singlePost";

const FollowingList = () => {
    const {userFollowingTweet}=usegetUserFollowingTweet()

  return (
    <div>
      <div>
        {userFollowingTweet &&
          userFollowingTweet.length !== 0 &&
          userFollowingTweet.map((tweet:any) => <SinglePost tweet={tweet} key={tweet.id} />)}
      </div>
    </div>
  );
};

export default FollowingList;
