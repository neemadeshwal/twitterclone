import SingleFollowUser from "@/components/home/rightSide/SingleFollowUser";
import SinglePost from "@/components/post/SinglePost/singlePost";
import DivisionBar from "@/shared/divisionbar";
import Loading from "@/shared/loading";
import ScrollTop from "@/shared/ScrollTop";
import { SearchResultProps } from "../searchTabs";

const TopTab = ({ searchResult,query,isLoading }:{searchResult:SearchResultProps,query:string,isLoading:boolean}) => {

  if (isLoading||!searchResult) {
    return (
      <div className="flex justify-center py-4">
        <Loading />
      </div>
    );
  }

  const noSearchResult =
    !searchResult.people?.length &&
    !searchResult.hashtag?.length &&
    !searchResult.post?.length;
  if (searchResult && noSearchResult) {
    return (
      <div className="py-10 flex flex-col justify-center items-center">
        <h3 className="text-lg font-bold mb-4">No results for {query}</h3>
        <p className="text-gray-500 text-sm">
          Try searching for something else
        </p>
      </div>
    );
  }
  return (
    <div className="py-4 ">
      <ScrollTop/>
      <div className="">
        {searchResult &&
          searchResult.people.length !== 0 && (
            <div className="">
              <div className="py-6 pt-0 px-6">
                <h3 className="text-[20px] font-[800]">People</h3>
              </div>
              <div className="flex flex-col gap-6 px-4">
                {searchResult.people.slice(0, 4).map((item: any) => {
                  return (
                    <SingleFollowUser
                      filterArray={false}
                      key={item.id}
                      singleUser={item}
                    />
                  );
                })}
              </div>
              {searchResult.people.length > 4 && (
                <div className="">See all</div>
              )}
              <div className="py-6">
                <DivisionBar type="x" />
              </div>
            </div>
          )}
        <div className="">
          {searchResult &&
            searchResult.hashtag.length !== 0 && (
              <div>
                {searchResult.hashtag
                  .slice(0, 4)
                  .map((item: any, index: number) => {
                    return (
                      <div
                        className=""
                        key={index + "hashtage" + "index" + index}
                      >
                        {item.tweets &&
                          item.tweets.length !== 0 &&
                          item.tweets.map((tweet: any) => {
                            return <SinglePost tweet={tweet} key={tweet.id} />;
                          })}
                      </div>
                    );
                  })}
                {searchResult.hashtag.length > 4 && (
                  <div className="">See all</div>
                )}
               
              </div>
            )}
        </div>
        <div>
          {searchResult &&
            searchResult.post.length !== 0 && (
              <div>
                {searchResult.post.slice(0, 4).map((tweet: any) => {
                  return <SinglePost tweet={tweet} key={tweet.id} />;
                })}
                
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TopTab;
