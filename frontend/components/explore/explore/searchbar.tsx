// SearchBar.tsx
"use client";
import { useSearchquery } from "@/hooks/search";
import React, { useEffect, useRef, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import ShowSearchPreview from "./showSearchPreview";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

interface SearchBarProps {
  currentTab: string;
  onTabChange: any;
  onSearchResults: (results: any) => void;
  query:any;
  setQuery:any;
}

const TABS = [
  { id: "top", label: "Top" },
  { id: "forYou", label: "For You" },

  { id: "trending", label: "Trending" },
  { id: "latest", label: "Latest" },

  { id: "people", label: "People" },

  { id: "hashtag", label: "Hashtag" },
  
  { id: "post", label: "Post" },
  { id: "media", label: "Media" },
];

const SearchBar: React.FC<SearchBarProps> = ({
  currentTab,
  onTabChange,
  onSearchResults,
  query,
  setQuery
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { allSearchResult } = useSearchquery(debouncedQuery);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // Reduced from 2000ms for better responsiveness

    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    if (isSearchFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchFocused]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (!query || e.key !== "Enter") return;

    e.preventDefault();
    setShowSearchResults(true);
    setShowPreview(false);
    onSearchResults(allSearchResult);
    onTabChange("top");
    setIsSearchFocused(false);
    addRecentSearch(query);
  };

  const addRecentSearch = (searchTerm: string) => {
    if (!searchTerm) return;

    const recentSearches = JSON.parse(
      localStorage.getItem("recentSearch") || "[]"
    );
    if (!recentSearches.includes(searchTerm)) {
      localStorage.setItem(
        "recentSearch",
        JSON.stringify([...recentSearches, searchTerm])
      );
    }
  };

  const handleBack = () => {
    setIsSearchFocused(false);
    setShowPreview(false);
    setShowSearchResults(false);
    setQuery("");
  };

  return (
    <div className="relative z-[100]">
      {isSearchFocused && (
        <button
          onClick={handleBack}
          className="absolute left-5 top-[12%] z-[100] p-2 hover:bg-[#5a5a5a3f] rounded-full"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
      )}

      <div className="backdrop-blur-md pt-1 bg-[#000000b0]">
        <div className="px-12 relative">
          <div
            className={`relative py-1 ${
              isSearchFocused ? "ml-10 w-[90%]" : "w-full"
            }`}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search"
              onClick={() => {
                setIsSearchFocused(true);
                setShowPreview(true);
              }}
              className={`w-full rounded-full px-12 py-2 outline-0 ${
                isSearchFocused
                  ? "bg-black border-[#1d9bf0] border"
                  : "bg-[#262626c0] border-gray-700"
              }`}
            />

            {query && isSearchFocused && (
              <button
                onClick={() => setQuery("")}
                className="x-bgcolor rounded-full absolute right-3 top-[25%]"
              >
                <BiX className="text-black w-6 h-6" />
              </button>
            )}

            <BiSearch
              className={`absolute top-[30%] left-4 text-[22px] ${
                isSearchFocused ? "x-textcolor" : "gray"
              }`}
            />

            {showPreview && (
              <ShowSearchPreview
                showSearchPreview={isSearchFocused}
                setIsSearchPreviewOpen={setShowPreview}
                allSearchResult={allSearchResult}
                setQuery={setQuery}
              />
            )}
          </div>

          <div className="flex items-center w-full">
            {TABS.map(({ id, label }) => {
              if (query && (id == "forYou" || id === "post"||id==="trending")) {
                return null;
              }
              if (!query && (id == "top" || id == "media"||id=="latest")) {
                return null;
              }
              return (
                <div
                  key={id}
                  onClick={() => onTabChange(id)}
                  className="relative w-1/3"
                >
                  <button className="py-4 px-4 w-full hover:bg-[#1d1d1dbb]">
                    {label}
                  </button>
                  {currentTab === id && (
                    <div className="absolute bottom-0 bg-blue-500 w-[50%] left-[28%] h-1 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

// TopTab.tsx
