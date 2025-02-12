import React from "react";
import { useGetAllTrending } from "@/hooks/tweet";
import Loading from "@/shared/loading";
import { Icons } from "@/utils/icons";

const TrendingTab = () => {
  const { allTrending } = useGetAllTrending();

  if (!allTrending) {
    return (
      <div className="rounded-[20px] border border-gray-700 p-4">
      
      <div className="flex items-center justify-center py-2">
        <Loading/>
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
      <div className="rounded-[20px] p-4">
        <p className="text-gray-500 text-sm">No trending topics yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] p-4">
      
      <div className="flex flex-col ">
        {allTrending?.trendingHashtag?.map((item) => (
          <div 
            key={item?.id}
            className="py-2 transition-colors flex justify-between"
          >
            <div>
            <span className="text-[14px] text-gray-500">Trending in Hashtags</span>
            <p className="font-medium my-1">{item?.text}</p>
            <span className="text-[14px] text-gray-500">{item?.tweets?.length} posts</span>
            </div>
            <div className="p-2 hover:bg-[#80808030] rounded-full cursor-pointer h-fit gray hover:text-white"><Icons.HorizontalDots/></div>
          </div>
        ))}

        {allTrending?.trendingTweet?.map((item) => (
          <div 
            key={item?.id}
            className="py-2 transition-colors cursor-pointer flex justify-between"
          >
            <div>
            <span className="text-[14px] text-gray-500">Popular Tweet</span>
            <p className="font-medium my-1 line-clamp-2">{item?.content}</p>
            <span className="text-[14px] text-gray-500">{item?.LikedBy?.length} likes</span>
            </div>
            <div className="p-2 hover:bg-[#80808030] rounded-full cursor-pointer h-fit gray hover:text-white"><Icons.HorizontalDots/></div>

          </div>
        ))}

        {allTrending?.trendingUser?.map((item) => (
          <div 
            key={item?.id}
            className="py-2 transition-colors cursor-pointer flex justify-between"
          >
            <div>
            <span className="text-[14px] text-gray-500">Trending in People</span>
            <p className="font-medium my-1">
              {item?.firstName} {item?.lastName}
            </p>
            <span className="text-[14px] text-gray-500">{item?.followers?.length} followers</span>
           </div>
            <div className="p-2 hover:bg-[#80808030] rounded-full cursor-pointer h-fit gray hover:text-white"><Icons.HorizontalDots/></div>

          </div>
        ))}
      </div>

     
    </div>
  );
};

export default TrendingTab;