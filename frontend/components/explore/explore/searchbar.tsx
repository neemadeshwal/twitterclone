"use client";
import { useSearchquery } from "@/hooks/search";
import React, { useEffect, useRef, useState } from "react";
import { BiLeftArrow, BiSearch } from "react-icons/bi";
import ShowSearchPreview from "./showSearchPreview";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

const SearchBar = ({ searchbarTab, setSearchBarTab }: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldFocus, setShouldFocus] = useState(false);
  const [query, setQuery] = useState("");
  const { allSearchResult } = useSearchquery(query);

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  const handleSearch = () => {
    console.log(allSearchResult, "search result");
  };

  useEffect(() => {
    if (query.length !== 0) {
      const debounced = setTimeout(() => {
        handleSearch();
      }, 2000);
      return () => {
        clearTimeout(debounced);
      };
    }
  }, [query]);
  console.log(shouldFocus, "shouldfocus");
  return (
    <div className="relative z-[100]">
      {shouldFocus && (
        <div
          onClick={(event) => {
            event.stopPropagation();
            setShouldFocus(false);
          }}
          className="absolute left-5 top-[12%] z-[100] p-2  cursor-pointer hover:bg-[#5a5a5a3f] rounded-full "
        >
          <ArrowLeftIcon
            onClick={() => setShouldFocus(false)}
            className="w-6 h-6"
          />
        </div>
      )}
      <div
        ref={inputRef}
        onClick={() => setShouldFocus(true)}
        className="backdrop-blur-md pt-1 bg-[#000000b0]  "
      >
        <div className="px-12 relative ">
          <div
            className={` ${
              shouldFocus ? "w-[90%] ml-10" : "w-full"
            } relative py-1 `}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="search"
              className={` w-full
            
 rounded-full px-12 py-2 bg-[#262626c0] focus:bg-black  outline-none focus:outline-[#1d9bf0] outline-1 `}
            />
            <BiSearch className="absolute top-[30%] gray  left-4 text-[22px] peer-focus:text-[#1d9bf0]" />
            {shouldFocus && (
              <ShowSearchPreview
                showSearchPreview={shouldFocus}
                setIsSearchPreviewOpen={setShouldFocus}
              />
            )}
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
    </div>
  );
};

export default SearchBar;
