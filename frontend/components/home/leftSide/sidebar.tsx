"use client";
import React from "react";
import { GoHome } from "react-icons/go";
import { MdHomeFilled } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import {
  IoIosNotificationsOutline,
  IoMdNotifications,
  IoMdMail,
} from "react-icons/io";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { FaSearch, FaRegUser, FaUser } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import { BsTwitterX } from "react-icons/bs";
import { BsFeather } from "react-icons/bs";
import { useCurrentUser } from "@/hooks/user";
import CurrentUser from "@/shared/currentUser";
import Link from "next/link";
import { usePathname } from "next/navigation";
const sidebarIcons = [
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
  const pathname = usePathname();
  return (
    <div>
      <div className="py-2 ">
        <div className=" p-3 hover:bg-[#2a2a2abb] rounded-full">
          <BsTwitterX className="text-[28px]" />
        </div>
        <div className="flex flex-col ">
          {sidebarIcons.map((item, index) => {
            return (
              <Link
                key={item.title + index}
                href={
                  item.title === "profile"
                    ? `/@${user?.userName}`
                    : item.activePathname
                }
              >
                <div className=" p-2 py-3 hover:bg-[#1d1d1dbb] cursor-pointer rounded-full flex items-center justify-center">
                  {pathname === item.activePathname ? (
                    <p className="text-[28px]">{item.iconActive}</p>
                  ) : (
                    <p className="text-[28px]">{item.icon}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="p-2 py-3 rounded-full hover:bg-[#1d1d1dbb] flex items-center justify-center cursor-pointer">
          <HiOutlineDotsCircleHorizontal className="text-[28px]" />
        </div>
        <div className="p-3 x-bgcolor rounded-full my-2 cursor-pointer">
          <BsFeather className="text-[28px]   " />
        </div>
        <div className="fixed bottom-8 ">
          <CurrentUser />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
