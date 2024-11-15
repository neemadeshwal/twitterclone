"use client";
import { useSearchquery } from "@/hooks/search";
import React, { useEffect, useRef, useState } from "react";
import { BiLeftArrow, BiSearch, BiX } from "react-icons/bi";
import ShowSearchPreview from "./showSearchPreview";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

const SearchBar = ({
  searchbarTab,
  setSearchBarTab,
  setSearchResultForTopTab,
}: any) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [shouldFocus, setShouldFocus] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { allSearchResult } = useSearchquery(debouncedQuery);
  const [showSearchResultPage, setShowSearchResultPage] = useState(false);
  const [showPreviewPage, setShowPreviewPage] = useState(false);
  const [goBack, setGoBack] = useState(false);
  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  const handleSearch = () => {
    console.log(allSearchResult, "search result");
  };
  console.log(allSearchResult, "search result");

  useEffect(() => {
    const debounced = setTimeout(() => {
      setDebouncedQuery(query);
    }, 2000);
    return () => {
      clearTimeout(debounced);
    };
  }, [query]);
  console.log(shouldFocus, "shouldfocus");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!query) {
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      setShowSearchResultPage(true);
      setShowPreviewPage(false);
      setSearchResultForTopTab(allSearchResult);
      setSearchBarTab("top");
      setShouldFocus(false);

      addItemToLocalStorage("recentSearch", query);
    }
  };
  function addItemToLocalStorage(key: string, newItem: string) {
    if (!newItem) {
      return;
    }
    console.log(newItem, "new item");
    const existingArray = localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key) as string)
      : [];

    console.log(existingArray, "array");

    existingArray.push(newItem);

    localStorage.setItem(key, JSON.stringify(existingArray));
  }
  return (
    <div className="relative z-[100]">
      {goBack && (
        <div
          onClick={(event) => {
            event.stopPropagation();
            setShouldFocus(false);
          }}
          className="absolute left-5 top-[12%] z-[100] p-2  cursor-pointer hover:bg-[#5a5a5a3f] rounded-full "
        >
          <ArrowLeftIcon
            onClick={() => {
              setShouldFocus(false);
              setGoBack(false);
              setShowSearchResultPage(false);
              setQuery("");
              setShowPreviewPage(false);
            }}
            className="w-6 h-6"
          />
        </div>
      )}
      <div
        ref={inputRef}
        onClick={() => {
          setShouldFocus(true);
          setShowPreviewPage(true);
          setGoBack(true);
        }}
        className="backdrop-blur-md pt-1 bg-[#000000b0]  "
      >
        <div className="px-12 relative ">
          <div
            className={` ${goBack ? "w-[90%] ml-10" : "w-full"} relative py-1 `}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="search"
              className={` w-full
            
 rounded-full px-12 py-2 bg-[#262626c0] *: focus:bg-black  outline-none focus:outline-[#1d9bf0] outline-1 `}
            />
            {query && (
              <div
                onClick={() => setQuery("")}
                className="x-bgcolor  rounded-full cursor-pointer absolute right-3 top-[25%] w-fit"
              >
                <BiX className="text-black w-6 h-6" />
              </div>
            )}
            <BiSearch className="absolute top-[30%] gray  left-4 text-[22px] peer-focus:text-[#1d9bf0]" />
            {showPreviewPage && (
              <ShowSearchPreview
                showSearchPreview={shouldFocus}
                setIsSearchPreviewOpen={setShouldFocus}
                allSearchResult={allSearchResult}
              />
            )}
          </div>
          <div className="flex items-center w-full">
            {showSearchResultPage && (
              <div
                onClick={() => setSearchBarTab("top")}
                className="relative w-1/3"
              >
                <button className="py-4 px-4 w-full hover:bg-[#1d1d1dbb]">
                  Top
                </button>
                {searchbarTab === "top" && (
                  <p className="absolute bottom-0 bg-blue-500 w-[50%] left-[28%] h-1 rounded-full"></p>
                )}
              </div>
            )}
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
