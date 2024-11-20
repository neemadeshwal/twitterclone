import React from "react";
import SingleFollowUser from "./SingleFollowUser";
import { getCurrentUser } from "@/graphql/types";

const RecommendedUser = ({ userList }: { userList: any }) => {
  return (
    <div>
      <div className="rounded-[20px] border-[1px] border-gray-700 py-4 px-4">
        <div className="py-6 pt-0">
          <h3 className="text-[18px] font-[800]">Who to follow</h3>
        </div>
        <div className="flex flex-col gap-5">
          {userList &&
            userList.length !== 0 &&
            userList.map((item: getCurrentUser) => {
              return (
                <SingleFollowUser
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
