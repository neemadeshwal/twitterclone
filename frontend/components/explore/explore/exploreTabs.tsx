"use client";
import DivisionBar from "@/shared/divisionbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const EXPLORETABS = [
  { id: "/for_you", label: "For You" },

  { id: "/trending", label: "Trending" },

  { id: "/people", label: "People" },

  { id: "/hashtag", label: "Hashtag" },

  { id: "/post", label: "Post" },
];

const ExploreTabs = () => {
  const pathname = usePathname();
  return (
    <div>
      <div className="flex items-center overflow-x-auto  w-full">
        {EXPLORETABS.map(({ id, label }) => {
          return (
            <Link
              href={`/explore/tabs${id}`}
              key={id}
              className="relative min-w-[100px]  w-1/3"
            >
              <button className="  min-w-[100px] py-4 px-4 w-full hover:bg-[#1d1d1dbb]">
                {label}
              </button>
              {(pathname === `/explore/tabs${id}` ||
                (pathname === "/explore" && id == "/for_you")) && (
                <div className="absolute bottom-0 bg-blue-500 w-[50%] left-[28%] h-1 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
      <DivisionBar type="x" />
    </div>
  );
};

export default ExploreTabs;
