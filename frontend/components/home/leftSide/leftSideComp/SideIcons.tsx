"use client";
import React, { memo } from "react";
import { Icons } from "@/utils/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/graphql/types";

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

const SideIcons = ({ currentUser,position }: { currentUser: getCurrentUser | null,position:"x"|"y" }) => {
  const pathname = usePathname();

  return (
    
      <div className={`flex  ${position==="x"?"flex-row w-full justify-between":"flex-col gap-2 "}`}>
        {sidebarIcons.map((item, index) => (
          <Link
            key={item.title + index}
            href={
              item.title === "profile"
                ? `/${currentUser?.userName}`
                : item.activePathname
            }
          >
            <div
              aria-label={`Go to ${item.title}`}
              className="p-2  fullWidth w-fit hover:bg-[#1d1d1dbb] cursor-pointer rounded-full flex items-center justify-center fixPosition px-width"
            >
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
  );
};

export default memo(SideIcons);
