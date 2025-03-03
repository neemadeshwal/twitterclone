"use client";
import Logout from "@/components/logout/logout";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { getCurrentUser } from "@/graphql/types";
import CurrentUser from "@/shared/currentUser";
import { Icons } from "@/utils/icons";
import { useState } from "react";

const ProfileContainer = ({
  currentUser,
}: {
  currentUser: getCurrentUser | null;
}) => {
  const [logoutDialog,setShowLogoutDialog]=useState(false)
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <div className="sticky bottom-8 bg-black p-3 w-fit fullWidth hover:bg-[#1d1d1dbb] rounded-full cursor-pointer">
            <div className="flex justify-between w-full relative  items-center">
              <div className="flex items-center gap-2">
                <CurrentUser user={currentUser} />
                <div className=" flex-col justify-center showPostName hidden items-start">
                  <div className="font-[700] text-[14px]">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </div>
                  <div className="gray text-[14px]">
                    @{currentUser?.userName}
                  </div>
                </div>
              </div>
              <div className="showPostName hidden">
                <Icons.HorizontalDots />
              </div>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          style={{
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
          }}
          className="absolute  left-[-5px] border-0 bottom-1 px-0   text-white rounded-[15px] w-[280px] z-50 min-h-[100px] h-auto py-3 bg-black"
        >
          <div className="absolute z-50  ">
            <div className="flex flex-col z-50 ">
              <div className="flex items-center gap-2 hover-bg py-3 px-0">
                <div  onClick={()=>setShowLogoutDialog(true)} className="flex gap-2 items-center">
                  <p className="text-[16px] font-[600] px-4">
                    Log out @{currentUser?.userName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {logoutDialog && <Logout isDialogOpen={logoutDialog} setisDialogOpen={setShowLogoutDialog} />}

    </div>
  );
};

export default ProfileContainer;
