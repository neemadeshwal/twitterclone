"use client";
import React, { useState } from "react";
import { GoHome } from "react-icons/go";
import { MdHomeFilled } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import {
  IoIosNotificationsOutline,
  IoMdNotifications,
  IoMdMail,
} from "react-icons/io";
import {
  HiOutlineDotsCircleHorizontal,
  HiOutlineDotsHorizontal,
} from "react-icons/hi";
import { FaSearch, FaRegUser, FaUser } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import { BsTwitterX } from "react-icons/bs";
import { BsFeather } from "react-icons/bs";
import { useCurrentUser } from "@/hooks/user";
import CurrentUser from "@/shared/currentUser";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MoreContainer from "@/shared/moreContainer";
import { FaEllipsisVertical } from "react-icons/fa6";
import LogOutContainer from "@/shared/logoutContainer";
import PostContainer from "@/shared/postContainer";
export const sidebarIcons = [
  {
    title: "home",
    icon: <GoHome />,
    iconActive: <MdHomeFilled />,
    activePathname: "/",
  },
  {
    title: "explore",
    icon: <IoSearch />,
    iconActive: <FaSearch />,
    activePathname: "/explore",
  },
  {
    title: "notifications",
    icon: <IoIosNotificationsOutline />,
    iconActive: <IoMdNotifications />,
    activePathname: "/notifications",
  },
  {
    title: "messages",
    icon: <CiMail />,
    iconActive: <IoMdMail />,
    activePathname: "/messages",
  },
  {
    title: "profile",
    icon: <FaRegUser />,
    iconActive: <FaUser />,
    activePathname: "/profile",
  },
];

const Sidebar = () => {
  const { user } = useCurrentUser();
  const [moreContainer, setMoreContainer] = useState(false);
  const pathname = usePathname();
  const [logoutContainer, setLogoutContainer] = useState(false);

  return (
    <div className="flex flex-col h-full items-center justify-between">
      {/* Main content section */}
      <div className="flex-1">
        <div className="py-2">
          {/* Logo */}
          <div className="p-3 w-fit  hover:bg-[#2a2a2abb] rounded-full">
            <BsTwitterX className="text-[28px]" />
          </div>

          {/* Navigation Icons */}
          <div className="flex flex-col gap">
            {sidebarIcons.map((item, index) => (
              <Link
                key={item.title + index}
                href={
                  item.title === "profile"
                    ? `/@${user?.userName}`
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
          <div
            onClick={() => setMoreContainer(true)}
            className="p-2 more-bottom-height mt-2 rounded-full fullWidth w-fit hover:bg-[#1d1d1dbb] flex items-center justify-center cursor-pointer fixPosition px-width"
          >
            <HiOutlineDotsCircleHorizontal className="text-[28px]" />
            {moreContainer && (
              <MoreContainer setMoreContainer={setMoreContainer} />
            )}
            <span className="hidden showIcon capitalize">more</span>
          </div>

          {/* Post Button */}
          <PostContainer/>
        
        </div>
      </div>

      {/* Current User Section - Sticky */}
      <div
        onClick={() => setLogoutContainer(true)}
        className="sticky bottom-8 bg-black p-3 w-fit fullWidth hover:bg-[#1d1d1dbb] rounded-full cursor-pointer"
      >
        <div className="flex justify-between w-full relative  items-center">
          <div className="flex items-center gap-2">
            <CurrentUser />
            <div className=" flex-col justify-center showPostName hidden items-start">
              <div className="font-[700] text-[14px]">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="gray text-[14px]">@{user?.userName}</div>
            </div>
          </div>
          <div className="showPostName hidden">
            <HiOutlineDotsHorizontal />
          </div>
        </div>
      </div>
      <div className="relative"> 
        {logoutContainer && (
          <LogOutContainer
            setLogoutContainer={setLogoutContainer}
            userName={user?.userName}
          />
        )}
      </div>
      
    </div>
  );
};

export default Sidebar;
