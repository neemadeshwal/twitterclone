import { useAllTweet } from "@/hooks/tweet";
import React, { useEffect, useState } from "react";
import SinglePost from "@/components/post/singlePost";

const HashtagTab = () => {
  const { allTweet } = useAllTweet();
  const [tweetList, setTweetList] = useState(allTweet);
  console.log(allTweet, "alltweet");

  useEffect(() => {
    if (allTweet && allTweet.length !== 0 && tweetList?.length !== 0) {
      const sortedTweet = allTweet.filter((tweet) => tweet.hashtags.length > 0);
      console.log(sortedTweet, "sorted");
      setTweetList(sortedTweet);
    }
  }, [allTweet]);

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

export default HashtagTab;
