"use client";
import { getCurrentUser } from "@/graphql/types";
import CurrentUser from "@/shared/currentUser";
import LogOutContainer from "@/shared/logoutContainer";
import { Icons } from "@/utils/icons";
import React, { useState } from "react";

const ProfileContainer = ({
  currentUser,
}: {
  currentUser: getCurrentUser | null;
}) => {
  const [logoutContainer, setLogoutContainer] = useState(false);

  return (
    <div>
      <div
        onClick={() => setLogoutContainer(true)}
        className="sticky bottom-8 bg-black p-3 w-fit fullWidth hover:bg-[#1d1d1dbb] rounded-full cursor-pointer"
      >
        <div className="flex justify-between w-full relative  items-center">
          <div className="flex items-center gap-2">
            <CurrentUser user={currentUser} />
            <div className=" flex-col justify-center showPostName hidden items-start">
              <div className="font-[700] text-[14px]">
                {currentUser?.firstName} {currentUser?.lastName}
              </div>
              <div className="gray text-[14px]">@{currentUser?.userName}</div>
            </div>
          </div>
          <div className="showPostName hidden">
            <Icons.HorizontalDots />
          </div>
        </div>
      </div>
      <div className="relative">
        {logoutContainer && (
          <LogOutContainer
            setLogoutContainer={setLogoutContainer}
            userName={currentUser?.userName}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileContainer;
