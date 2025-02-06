import React from "react";
import SingleFollowUser from "./SingleFollowUser";
import { getCurrentUser } from "@/graphql/types";

const TrendingTopics = () => {
  return (
    <div>
      <div className="rounded-[20px] border-[1px] border-gray-700 py-4 px-4">
        <div className="py-6 pt-0">
          <h3 className="text-[18px] font-[800]">What’s happening</h3>
        </div>
        <div className="flex flex-col gap-5"></div>
      </div>
    </div>
  );
};

export default TrendingTopics;
