"use client";
import ComposePost from "@/components/post/compostPost";
import FollowingList from "@/components/post/followingList";
import PostList from "@/components/post/postlist";
import ComposePostIcon from "@/shared/ComposePostIcon";
import CurrentUser from "@/shared/currentUser";
import DivisionBar from "@/shared/divisionbar";
import React, { useState } from "react";
import { BsTwitterX } from "react-icons/bs";

const MiddlePost = () => {
  const [isForYou, setIsForYou] = useState(true);

  return (
    <div className="flex flex-col h-full">
      <div className="flex sm:hidden w-[50%] pl-4 py-2 justify-between items-center ">
        <CurrentUser customSize={true} />
        <BsTwitterX className="lg:text-[290px] text-[24px]" />
      </div>
      <div className="relative sm:sticky  top-0 z-50 backdrop-blur-sm">
        <div className="flex">
          <div
            onClick={() => setIsForYou(true)}
            className="w-1/2 text-center cursor-pointer hover:bg-[#1d1d1dbb] justify-center flex items-center"
          >
            <div
              className={`relative w-fit h-full py-4 ${
                isForYou ? "text-white font-[600]" : "text-gray-400 font-[400]"
              }`}
            >
              For you
              {isForYou && (
                <p className="absolute bottom-0 bg-blue-500 w-full h-1 rounded-full"></p>
              )}
            </div>
          </div>
          <div
            onClick={() => setIsForYou(false)}
            className="w-1/2 text-center cursor-pointer hover:bg-[#1d1d1dbb] justify-center flex items-center"
          >
            <div
              className={`relative w-fit h-full py-4 ${
                !isForYou ? "text-white font-[600]" : "text-gray-400 font-[400]"
              }`}
            >
              Following
              {!isForYou && (
                <p className="absolute bottom-0 bg-blue-500 w-full h-1 rounded-full"></p>
              )}
            </div>
          </div>
        </div>
        <DivisionBar type="x" />
      </div>

      <div className=" w-full overflow-hidden">
        <div className="w-full md:inline-block hidden">
          <ComposePost />
        </div>
        {
          isForYou?
        <PostList />:<FollowingList/>


        }
      </div>
      <div className="sm:hidden">
      <ComposePostIcon/>

      </div>
    </div>
  );
};

export default MiddlePost;
