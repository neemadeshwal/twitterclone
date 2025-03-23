"use client";
import { useAllBookmark } from "@/hooks/bookmark";
import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import SingleBookmark from "./SingleBookmark";
import Loading from "@/shared/loading";

const BookmarkList = () => {
  const { allBookmark } = useAllBookmark();
  console.log(allBookmark, "allbookmark");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkData, setBookmarkData] = useState(allBookmark);
  useEffect(() => {
    setBookmarkData((prevVal) =>
      prevVal?.filter(
        (item) =>
          item?.tweet?.content
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item?.comment?.content
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  if (!bookmarkData || !allBookmark) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }
  if (bookmarkData?.length == 0) {
    return (
      <div className="rounded-[20px] p-4">
        <p className="text-gray-500 text-lg text-center">No bookmarks yet.</p>
      </div>
    );
  }
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
        <div className="  py-2 px-6 ">
          <div>
            <div className="relative">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="search"
                className="w-full rounded-full px-12 py-2 bg-[#262626c0] focus:bg-black  outline-none focus:outline-[#1d9bf0] outline-1 "
              />
              <BiSearch className="absolute top-[22%] gray  left-4 text-[22px] peer-focus:text-[#1d9bf0]" />
            </div>
          </div>
        </div>
      }
      {allBookmark &&
        bookmarkData &&
        bookmarkData.length !== 0 &&
        bookmarkData.map((singleBookmark) => {
          console.log("check bookmark");
          return (
            <div key={singleBookmark.id}>
              <SingleBookmark bookmark={singleBookmark} />
            </div>
          );
        })}
    </div>
  );
};

export default BookmarkList;
