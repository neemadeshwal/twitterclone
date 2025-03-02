import React from "react";
import { useGetAllTrending } from "@/hooks/tweet";
import Loading from "@/shared/loading";
import { Icons } from "@/utils/icons";

const TrendingTopics = () => {
  const { allTrending } = useGetAllTrending();

  if (!allTrending) {
    return (
      <div className="rounded-[20px] border border-gray-700 p-4">
        <div className="flex items-center justify-center py-2">
          <Loading />
        </div>
      </div>
    );
  }

  const noTrendingData =
    !allTrending.trendingHashtag?.length &&
    !allTrending.trendingTweet?.length &&
    !allTrending.trendingUser?.length;

  if (noTrendingData) {
    return (
      <div className="rounded-[20px] border border-gray-700 p-4">
        <h3 className="text-lg font-bold mb-4">What&apos;s happening</h3>
        <p className="text-gray-500 text-sm">No trending topics yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] border border-gray-700 p-4">
      <h3 className="text-lg font-bold mb-4">What&apos;s happening</h3>

      <div className="flex flex-col ">
        {allTrending?.trendingHashtag?.slice(0, 2).map((item) => (
          <div
            key={item?.id}
            className="py-2 transition-colors flex justify-between"
          >
            <div>
              <span className="text-[14px] text-gray-500">
                Trending in Hashtags
              </span>
              <p className="font-medium my-1">{item?.text}</p>
              <span className="text-[14px] text-gray-500">
                {item?.tweets?.length} posts
              </span>
            </div>
            <div className="p-2 hover:bg-[#80808030] rounded-full cursor-pointer h-fit gray hover:text-white">
              <Icons.HorizontalDots />
            </div>
          </div>
        ))}

        {allTrending?.trendingTweet?.slice(0, 2).map((item) => (
          <div
            key={item?.id}
            className="py-2 transition-colors cursor-pointer flex justify-between"
          >
            <div>
              <span className="text-[14px] text-gray-500">Popular Tweet</span>
              <p className="font-medium my-1 line-clamp-2">{item?.content}</p>
              <span className="text-[14px] text-gray-500">
                {item?.likedBy?.length} likes
              </span>
            </div>
            <div className="p-2 hover:bg-[#80808030] rounded-full cursor-pointer h-fit gray hover:text-white">
              <Icons.HorizontalDots />
            </div>
          </div>
        ))}

        {allTrending?.trendingUser?.slice(0, 2).map((item) => (
          <div
            key={item?.id}
            className="py-2 transition-colors cursor-pointer flex justify-between"
          >
            <div>
              <span className="text-[14px] text-gray-500">
                Trending in People
              </span>
              <p className="font-medium my-1">
                {item?.firstName} {item?.lastName}
              </p>
              <span className="text-[14px] text-gray-500">
                {item?.followers?.length} followers
              </span>
            </div>
            <div className="p-2 hover:bg-[#80808030] rounded-full cursor-pointer h-fit gray hover:text-white">
              <Icons.HorizontalDots />
            </div>
          </div>
        ))}
      </div>

      <button className="w-full text-left text-blue-400 hover:text-blue-300 transition-colors mt-4 text-sm">
        Show more
      </button>
    </div>
  );
};

export default TrendingTopics;
