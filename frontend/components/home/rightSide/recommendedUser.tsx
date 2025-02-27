import React from "react";
import SingleFollowUser from "./SingleFollowUser";
import { getCurrentUser } from "@/graphql/types";
import Loading from "@/shared/loading";

const RecommendedUser = ({ userList,isBio }: { userList: any,isBio?:boolean }) => {

  if(!userList){
    return(
      <div className="rounded-[20px] border border-gray-700 p-4">
      
      <div className="flex items-center justify-center py-2">
        <Loading/>
      </div>
      </div>
    )
  }
  if(userList&&!userList.length){
    return (
      <div className="rounded-[20px] border border-gray-700  p-4 py-6">
        <p className="text-gray-500 text-sm">No Users yet</p>
      </div>
    )
  }
  return (
    <div>
      <div className={ `rounded-[20px]  ${!isBio&&"border-gray-700 border-[1px]"} py-4 px-4`}>
        <div className="py-6 pt-0">
          <h3 className="text-[18px] font-[800]">Who to follow</h3>
        </div>
        <div className="flex flex-col gap-5">
          {userList &&
            userList.length !== 0 &&
            userList.map((item: getCurrentUser) => {
              return (
                <SingleFollowUser
                isBio={isBio}
                  key={item.id}
                  singleUser={item}
                  filterArray={true}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RecommendedUser;
