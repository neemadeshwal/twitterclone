"use client";
import { getUserByIdQuery } from "@/graphql/query/user";
import { useCurrentUser, useGetUserById } from "@/hooks/user";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import ProfileDisplay from "./proflleDisplay";

const UserDetail = () => {
  const { user: currentUser } = useCurrentUser();
  //   if (currentUser) {
  const { user } = useGetUserById(currentUser?.id!);
  console.log(user, "user id get user");
  //   }
  return (
    <div className="flex flex-col h-full ">
      <div className="sticky top-0 z-50 backdrop-blur-sm py-1 px-0 sm:px-4 bg-black/60">
        <div className="flex gap-9 items-center ">
          <div>
            <FaArrowLeft />
          </div>
          <div>
            <h2 className="font-[600] text-[18px] capitalize">
              {user?.firstName} {user?.lastName}
            </h2>
            <h4 className="font-[300] gray text-[14px]">
              {user?.posts.length} posts
            </h4>
          </div>
        </div>
      </div>
      {user && (
        <div className=" h-[200vh] ">
          <ProfileDisplay user={user} />
        </div>
      )}
    </div>
  );
};

export default UserDetail;
