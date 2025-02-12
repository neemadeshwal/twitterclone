import DivisionBar from "@/shared/divisionbar";

import SearchInput from "../../SearchInput";
import SingleTweetHighlight from "./SingleTweetHighlight";
import { Icons } from "@/utils/icons";
import RecommendedUser from "@/components/home/rightSide/recommendedUser";
import Loading from "@/shared/loading";
import { getForYouData } from "@/lib/ServerFetchApi/ServerSideFunc";

const ForYou = async() => {
  const allForYou =await getForYouData()
  if (
    !allForYou?.forYouTweet ||
    !allForYou?.forYouHashtag ||
    !allForYou?.forYouTweet
  ) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <SearchInput />
      <div className="min-h-screen w-full">
        <div>
          <div>
            {allForYou?.forYouTweet && allForYou.forYouTweet.length !== 0 && (
              <div className="py-4">
                <div>
                  <div className="flex flex-col gap-6 px-4">
                    {allForYou?.forYouTweet.map((item: any) => {
                      return (
                        <SingleTweetHighlight tweet={item} key={item.id} />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            <DivisionBar type="x" />
          </div>
          <div>
            <div className="px-4">
              {allForYou?.forYouHashtag?.slice(0, 5).map((item) => (
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
            </div>
            <DivisionBar type="x" />
          </div>
          <div>
            <div>
              {allForYou?.forYouUser && allForYou.forYouUser.length !== 0 && (
                <RecommendedUser
                  isBio={true}
                  userList={allForYou?.forYouUser}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForYou;
