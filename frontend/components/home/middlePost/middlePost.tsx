"use client";
import React, { useState } from "react";

import ComposePost from "@/components/post/compostPost";
import FollowingList from "@/components/post/followingList";
import PostList from "@/components/post/postlist";
import { getCurrentUser } from "@/graphql/types";
import ComposePostIcon from "@/shared/ComposePostIcon";
import CurrentUser from "@/shared/currentUser";
import DivisionBar from "@/shared/divisionbar";
import { Icons } from "@/utils/icons";

const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-1/2 text-center cursor-pointer hover:bg-[#1d1d1dbb] flex items-center justify-center ${
        isActive ? "text-white font-[600]" : "text-gray-400 font-[400]"
      }`}
    >
      <div className="relative w-fit h-full py-4">
        {label}
        {isActive && (
          <p className="absolute bottom-0 bg-blue-500 w-full h-1 rounded-full"></p>
        )}
      </div>
    </button>
  );
};
const MiddlePost = ({ user }: { user: getCurrentUser | null }) => {
  const [isForYou, setIsForYou] = useState(true);

  return (
    <div className="flex flex-col h-full">
      <div className="flex sm:hidden w-[50%] pl-4 py-2 justify-between items-center ">
        <CurrentUser user={user} customSize={true} />
        <Icons.TwitterX className="lg:text-[290px] text-[24px]" />
      </div>
      <div className="relative sm:sticky  top-0 z-50 backdrop-blur-sm">
        <div className="flex">
          <TabButton
            label="For you"
            isActive={isForYou}
            onClick={() => setIsForYou(true)}
          />
          <TabButton
            label="Following"
            isActive={!isForYou}
            onClick={() => setIsForYou(false)}
          />
        </div>
        <DivisionBar type="x" />
      </div>

      <div className=" w-full overflow-hidden">
        <div className="w-full md:inline-block hidden">
          <ComposePost user={user} />
        </div>
        {isForYou ? <PostList /> : <FollowingList />}
      </div>
      <div className="sm:hidden">
        <ComposePostIcon />
      </div>
    </div>
  );
};

export default MiddlePost;
