import SingleFollowUser from "@/components/home/rightSide/SingleFollowUser";
import SinglePost from "@/components/post/SinglePost/singlePost";
import DivisionBar from "@/shared/divisionbar";
import React from "react";

const TopTab = ({ searchResult }: any) => {
  return (
    <div className="py-4 ">
      <div className="">
        {searchResult &&
          searchResult.length !== 0 &&
          searchResult.people.length !== 0 && (
            <div className="">
              <div className="py-6 pt-0 px-6">
                <h3 className="text-[20px] font-[800]">People</h3>
              </div>
              <div className="flex flex-col gap-6 px-4">
                {searchResult.people.map((item: any) => {
                  return (
                    <SingleFollowUser
                      filterArray={false}
                      key={item.id}
                      singleUser={item}
                    />
                  );
                })}
              </div>
              <div className="py-6">
                <DivisionBar type="x" />
              </div>
            </div>
          )}
        <div className="">
          {searchResult &&
            searchResult.length !== 0 &&
            searchResult.hashtag.length !== 0 &&
            searchResult.hashtag.map((item: any, index: number) => {
              return (
                <div className="" key={index + "hashtage" + "index" + index}>
                  {item.tweets &&
                    item.tweets.length !== 0 &&
                    item.tweets.map((tweet: any) => {
                      return <SinglePost tweet={tweet} key={tweet.id} />;
                    })}
                </div>
              );
            })}
        </div>
        <div>
          {searchResult &&
            searchResult.length !== 0 &&
            searchResult.post.length !== 0 &&
            searchResult.post.map((tweet: any) => {
              return <SinglePost tweet={tweet} key={tweet.id} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default TopTab;
