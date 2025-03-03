"use client";
import React, { useRef, useState } from "react";

import ComposePost from "@/components/post/compostPost";
import FollowingList from "@/components/post/followingList";
import PostList from "@/components/post/postlist";
import { getCurrentUser } from "@/graphql/types";
import ComposePostIcon from "@/shared/ComposePostIcon";
import CurrentUser from "@/shared/currentUser";
import DivisionBar from "@/shared/divisionbar";
import { Icons } from "@/utils/icons";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logout from "@/components/logout/logout";
import useOutsideClick from "@/shared/closeContainer";

export const sheetIcons = [
  {
    title: "profile",
    icon: <Icons.Profile />,
    iconActive: <Icons.ProfileActive />,
    activePathname: "/profile",
  },
  {
    title: "bookmarks",
    icon: <Icons.Bookmark />,
    iconActive: <Icons.BookMarkActive />,
    activePathname: "/bookmarks",
  },
  {
    title: "settings",
    icon: <Icons.Settings />,
    iconActive: <Icons.SettingsActive />,
    activePathname: "/settings",
  },
];

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
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [logoutDialog, setShowLogoutDialog] = useState(false);
  const sheetRef = useRef(null);

  useOutsideClick(sheetRef, () => setIsSheetOpen(false));

  return (
    <div className="flex flex-col h-full">
      <div className="flex sm:hidden w-[50%] pl-4 py-2 justify-between items-center ">
        <div>
          <Sheet open={isSheetOpen}>
            <SheetTrigger onClick={() => setIsSheetOpen(true)}>
              <CurrentUser user={user} customSize={true} />
            </SheetTrigger>
            <SheetContent
              ref={sheetRef}
              side="left"
              className="w-[75%] z-[1000]  bg-black text-white"
            >
              <SheetHeader>
                <SheetTitle className="text-white">
                  <div>
                    <CurrentUser user={user} customSize={true} />
                    <div className="flex items-start flex-col gap-0 my-3">
                      <h3 className="font-[600] text-[18px] leading-[20px] capitalize">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="font-[300] gray text-[14px]">
                        @{user?.userName}
                      </p>
                    </div>
                    <div className="flex gap-4 text-[14px] gray capitalize">
                      <div>
                        <span className="text-white">
                          {user?.followingList.length}
                        </span>{" "}
                        Following
                      </div>
                      <div>
                        <span className="text-white">
                          {user?.followers.length}
                        </span>{" "}
                        followers
                      </div>
                    </div>
                  </div>
                </SheetTitle>
                <div className="text-white pt-3">
                  {sheetIcons.map((item, index) => (
                    <Link
                      onClick={() => setIsSheetOpen((prev) => !prev)}
                      key={item.title + index}
                      href={
                        item.title === "profile"
                          ? `/${user?.userName}`
                          : item.activePathname
                      }
                    >
                      <div
                        aria-label={`Go to ${item.title}`}
                        className="p-2  fullWidth w-fit hover:bg-[#1d1d1dbb] cursor-pointer rounded-full flex items-center justify-center gap-5 fixPosition px-width"
                      >
                        {pathname === item.activePathname ? (
                          <p className="text-[20px]">{item.iconActive}</p>
                        ) : (
                          <p className="text-[20px]">{item.icon}</p>
                        )}
                        <span className=" showIcon capitalize text-white text-[18px]">
                          {item.title}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div
                  onClick={() => {
                    setShowLogoutDialog(true);
                    setIsSheetOpen((prev) => !prev);
                  }}
                  className="flex p-2 pt-0 items-center gap-5 px-width"
                >
                  <span>
                    <Icons.Logout className="w-[20px] font-[600]" />
                  </span>
                  <span className=" showIcon capitalize text-white text-[18px]">
                    logout
                  </span>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>x
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
      {logoutDialog && <Logout isDialogOpen={logoutDialog} setisDialogOpen={setShowLogoutDialog} />}
    </div>
  );
};

export default MiddlePost;
