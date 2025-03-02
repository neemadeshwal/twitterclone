"use client";
import React from "react";
import RecommendedUser from "./recommendedUser";
import { useGetAllUsers } from "@/hooks/user";
import TrendingTopics from "./TrendingTopics";
import { usePathname } from "next/navigation";
import SearchInput from "@/components/explore/SearchInput";

const RightSidebar = () => {
  const { allUsers } = useGetAllUsers();
  console.log(allUsers, "allusers");
  const pathname = usePathname();
  return (
    <div className="">
      <div className="px-6">
        {!pathname.startsWith("/explore") &&
          !pathname.startsWith("/search") && <SearchInput />}
        <div className="h-[200vh] text-[15px] flex flex-col gap-4 py-6">
          {pathname !== "/explore" && <TrendingTopics />}
          <RecommendedUser userList={allUsers} />
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
