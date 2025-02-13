import React from "react";
import SingleFollowUser from "@/components/home/rightSide/SingleFollowUser";
import { getCurrentUser } from "@/graphql/types";
import { getAllUsersData } from "@/lib/ServerFetchApi/ServerSideFunc";
import Loading from "@/shared/loading";

const PeopleTab = ({userList,query}:{userList:getCurrentUser[],query:string}) => {
    console.log(userList,query,"userlistinsearch")

  if(!userList){
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }
  if (userList&& !userList.length) {
    return (
        <div className="py-10 flex flex-col justify-center items-center">
        <h3 className="text-lg font-bold mb-4">No results for {query}</h3>
        <p className="text-gray-500 text-sm">
          Try searching for something else
        </p>
      </div>
    );
  }

  const sortedUserList=userList.sort(
    (a,b)=>b.followers.length-a.followers.length
  )

  return (
    <div>
      <div className="rounded-[20px] py-4 px-4">
        <div className="py-6 pt-0">
          <h3 className="text-[18px] font-[800]">People</h3>
        </div>
        <div className="flex flex-col gap-5">
          {
            sortedUserList.map((item: getCurrentUser) => {
              return <SingleFollowUser key={item.id} singleUser={item} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default PeopleTab;
