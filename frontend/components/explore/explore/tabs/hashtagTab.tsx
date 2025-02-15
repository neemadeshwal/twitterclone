import SinglePost from "@/components/post/SinglePost/singlePost";
import { getAllPostData } from "@/lib/ServerFetchApi/ServerSideFunc";
import Loading from "@/shared/loading";

const HashtagTab = async () => {
  const allTweet = await getAllPostData();

  if (!allTweet) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }

  if (allTweet && !allTweet.length) {
    return (
      <div className="rounded-[20px] p-4">
        <p className="text-gray-500 text-sm">No hashtags yet</p>
      </div>
    );
  }
  const sortedTweet = allTweet.filter((tweet) => tweet.hashtags.length > 0);

  if (!sortedTweet.length) {
    return (
      <div className="rounded-[20px] p-4">
        <p className="text-gray-500 text-sm">No hashtags yet</p>
      </div>
    );
  }

  const tweetList = sortedTweet;

  return (
    <div>
      <div>
        {tweetList.map((tweet) => (
          <SinglePost tweet={tweet} key={tweet.id} />
        ))}
      </div>
    </div>
  );
};

export default HashtagTab;
