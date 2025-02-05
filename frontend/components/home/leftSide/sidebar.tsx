"use client";
import React from "react";
import Link from "next/link";

import { Icons } from "@/utils/icons";

import { useCurrentUser } from "@/hooks/user";
import { usePathname } from "next/navigation";
import MoreContainer from "@/shared/moreContainer";
import { getCurrentUser } from "@/graphql/types";
import PostButton from "./leftSideComp/PostButton";
import ProfileContainer from "./leftSideComp/ProfileContainer";
import MoreContainerTrigger from "./leftSideComp/MoreContainerTrigger";
export const sidebarIcons = [
  {
    title: "home",
    icon: <Icons.Home />,
    iconActive: <Icons.HomeActive />,
    activePathname: "/",
  },
  {
    title: "explore",
    icon: <Icons.Search />,
    iconActive: <Icons.SearchActive />,
    activePathname: "/explore",
  },
  {
    title: "notifications",
    icon: <Icons.Notification />,
    iconActive: <Icons.NotificationActive />,
    activePathname: "/notifications",
  },
  {
    title: "messages",
    icon: <Icons.Message />,
    iconActive: <Icons.MessageActive />,
    activePathname: "/messages",
  },
  {
    title: "profile",
    icon: <Icons.Profile />,
    iconActive: <Icons.ProfileActive />,
    activePathname: "/profile",
  },
];

const Sidebar = ({ currentUser }: { currentUser: getCurrentUser | null }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full items-center justify-between">
      {/* Main content section */}
      <div className="flex-1">
        <div className="py-2">
          {/* Logo */}
          <div className="p-3 w-fit  hover:bg-[#2a2a2abb] rounded-full">
            <Icons.TwitterX className="text-[28px]" />
          </div>

          {/* Navigation Icons */}
          <div className="flex flex-col gap">
            {sidebarIcons.map((item, index) => (
              <Link
                key={item.title + index}
                href={
                  item.title === "profile"
                    ? `/@${currentUser?.userName}`
                    : item.activePathname
                }
              >
                <div className="p-2  fullWidth w-fit hover:bg-[#1d1d1dbb] cursor-pointer rounded-full flex items-center justify-center fixPosition px-width">
                  {pathname === item.activePathname ? (
                    <p className="text-[28px]">{item.iconActive}</p>
                  ) : (
                    <p className="text-[28px]">{item.icon}</p>
                  )}
                  <span className="hidden showIcon capitalize text-[18px]">
                    {item.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* More Button */}
          <MoreContainerTrigger />

          {/* Post Button */}
          <PostButton />
        </div>
      </div>

      {/* Current User Section - Sticky */}
      <ProfileContainer currentUser={currentUser} />
    </div>
  );
};

export default Sidebar;
