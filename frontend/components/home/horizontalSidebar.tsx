"use client";
import React, { useEffect, useState } from "react";
import { sidebarIcons } from "./leftSide/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/user";

const HorizontalSidebar = () => {
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("");

  useEffect(() => {
    let debounceTimer: any;
    const handleScroll = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const currentScroll = window.scrollY;

        if (currentScroll > lastScrollTop) {
          setScrollDirection("down");
        } else if (currentScroll < lastScrollTop) {
          setScrollDirection("up");
        }
        setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll); // Ensure scrollTop doesn't go negative
      });
      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    };
  }, [lastScrollTop]);

  return (
    <div className="fixed bottom-0 w-full ">
      <div
        className={`flex justify-between  w-full px-4 py-1 ${
          scrollDirection === "down" ? "bg-black/50" : "bg-black"
        }`}
      >
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
              <div
                className={` p-2 ${
                  scrollDirection == "down" ? "text-white/50" : "text-white"
                } py-3 hover:bg-[#1d1d1dbb] cursor-pointer rounded-full flex items-center justify-center`}
              >
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
    </div>
  );
};

export default HorizontalSidebar;
