"use client";
import { useSearchquery } from "@/hooks/search";
import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";

const SearchBar = () => {
  const [searchbarTab, setSearchBarTab] = useState("people");
  const { allSearchResult } = useSearchquery("neema");
  console.log(allSearchResult, "allsearch");
  return (
    <div className="backdrop-blur-md pt-1 bg-[#000000b0] ">
      <div className="px-12">
        <div className="relative py-1 ">
          <input
            placeholder="search"
            className="w-full rounded-full px-12 py-2 bg-[#262626c0] focus:bg-black  outline-none focus:outline-[#1d9bf0] outline-1 "
          />
          <BiSearch className="absolute top-[22%] gray  left-4 text-[22px] peer-focus:text-[#1d9bf0]" />
        </div>
        <div className="flex items-center w-full">
          <div
            onClick={() => setSearchBarTab("people")}
            className="relative w-1/3"
          >
            <button className="py-4 px-4 w-full hover:bg-[#1d1d1dbb]">
              people
            </button>
            {searchbarTab === "people" && (
              <p className="absolute bottom-0 bg-blue-500 w-[50%] left-[28%] h-1 rounded-full"></p>
            )}
          </div>
          <div
            onClick={() => setSearchBarTab("hashtag")}
            className="relative w-1/3"
          >
            <button className="py-4 px-4 w-full hover:bg-[#1d1d1dbb]">
              hashtag
            </button>
            {searchbarTab === "hashtag" && (
              <p className="absolute bottom-0 bg-blue-500 w-[50%] left-[28%] h-1 rounded-full"></p>
            )}
          </div>
          <div
            onClick={() => setSearchBarTab("trending")}
            className="relative w-1/3"
          >
            <button className="py-4 px-4 w-full hover:bg-[#1d1d1dbb]">
              trending
            </button>
            {searchbarTab === "trending" && (
              <p className="absolute bottom-0 bg-blue-500 w-[50%] left-[28%] h-1 rounded-full"></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
