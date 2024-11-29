"use client";
import { useAllBookmark } from "@/hooks/bookmark";
import React from "react";
import { BiSearch } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";

const BookmarkList = () => {
  const { allBookmark } = useAllBookmark();
  console.log(allBookmark, "allbookmark");
  return (
    <div className="flex flex-col h-full ">
      <div className="sticky top-0 z-50 backdrop-blur-sm py-1 px-4 bg-black/60">
        <div className="flex gap-9 items-center ">
          <div>
            <FaArrowLeft />
          </div>
          <div className="py-2">
            <h2 className="font-[600] text-[18px] capitalize">bookmarks</h2>
          </div>
        </div>
      </div>
      {
        <div className=" h-[200vh] py-2 px-6 ">
          <div>
            <div className="relative">
              <input
                placeholder="search"
                className="w-full rounded-full px-12 py-2 bg-[#262626c0] focus:bg-black  outline-none focus:outline-[#1d9bf0] outline-1 "
              />
              <BiSearch className="absolute top-[22%] gray  left-4 text-[22px] peer-focus:text-[#1d9bf0]" />
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default BookmarkList;
