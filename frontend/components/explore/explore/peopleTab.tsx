"use client";
import React from "react";
import SingleFollowUser from "@/components/home/rightSide/SingleFollowUser";
import { getCurrentUser } from "@/graphql/types";
import { useGetAllUsers } from "@/hooks/user";

const PeopleTab = () => {
  const { allUsers: userList } = useGetAllUsers();

  return (
    <div>
      <div className="rounded-[20px] py-4 px-4">
        <div className="py-6 pt-0">
          <h3 className="text-[18px] font-[800]">People</h3>
        </div>
        <div className="flex flex-col gap-5">
          {userList &&
            userList.length !== 0 &&
            userList.map((item: getCurrentUser) => {
              return <SingleFollowUser key={item.id} singleUser={item} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default PeopleTab;
