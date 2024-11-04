import { getCurrentUser } from "@/graphql/types";
import DivisionBar from "@/shared/divisionbar";
import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineCalendarMonth } from "react-icons/md";
import PostTab from "./postTab";
import CommentTab from "./commentTab";

const ProfileDisplay = ({ user }: { user: getCurrentUser }) => {
  const [tabs, setTabs] = useState("post");
  console.log(user.posts, "user tweet");
  return (
    <div>
      <div className="relative">
        {user?.coverImgUrl ? (
          <div>
            <Image src={user.coverImgUrl} alt="" height="100" width="100" />
          </div>
        ) : (
          <div className="bg-[#3a3a3acd] w-full h-[170px]"></div>
        )}
        <div className="absolute bottom-[-10px] left-4">
          {user?.profileImgUrl ? (
            <Image src={user.profileImgUrl} alt="" width="150" height="150" />
          ) : (
            <div className="bg-cyan-900 w-[150px] h-[150px] border-[4px] border-black rounded-full flex items-center justify-center text-[70px]">
              N
            </div>
          )}
        </div>
        <div className="flex justify-end w-full py-3 px-4">
          <div className=" rounded-full py-2 px-4 border-[0.1px] capitalize border-white w-fit">
            <h4>edit profile</h4>
          </div>
        </div>
      </div>
      <div className="">
        <div className="py-6">
          <div className="px-4">
            <h3 className="text-[20px] font-[800] capitalize">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="gray font-[14px]">{user?.userName}</p>
          </div>
          <div className="py-3 px-4">
            <p className="gray font-[14px] flex items-center gap-2">
              <span>
                <MdOutlineCalendarMonth />
              </span>
              Joined october 2024
            </p>
          </div>
          <div className="flex gap-4 text-[14px] gray capitalize px-4">
            <div>
              <span className="text-white">1</span> Following
            </div>
            <div>
              <span className="text-white">23</span> followers
            </div>
          </div>
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div
                onClick={() => setTabs("post")}
                className="capitalize gray w-fit cursor-pointer p-4 px-10 hover:bg-[#1f1f1fb8]"
              >
                <p>posts</p>
              </div>
              <div
                onClick={() => setTabs("replies")}
                className="capitalize gray w-fit cursor-pointer p-4 px-10 hover:bg-[#1f1f1fb8]"
              >
                <p>replies</p>
              </div>
              <div
                onClick={() => setTabs("articles")}
                className="capitalize gray w-fit cursor-pointer p-4 px-10 hover:bg-[#1f1f1fb8]"
              >
                <p>articles</p>
              </div>
              <div
                onClick={() => setTabs("media")}
                className="capitalize gray w-fit cursor-pointer p-4 px-10 hover:bg-[#1f1f1fb8]"
              >
                <p>media</p>
              </div>
              <div
                onClick={() => setTabs("likes")}
                className="capitalize gray w-fit cursor-pointer p-4 px-10 hover:bg-[#1f1f1fb8]"
              >
                <p>likes</p>
              </div>
            </div>
            <DivisionBar type="x" />
          </div>
          {tabs === "post" ? (
            <PostTab postlist={user.posts} />
          ) : tabs === "replies" ? (
            <CommentTab comment={user.commentTweets} />
          ) : (
            "hello"
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDisplay;
