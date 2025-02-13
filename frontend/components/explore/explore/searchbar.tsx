// SearchBar.tsx
"use client";
import { useSearchquery } from "@/hooks/search";
import React, { useEffect, useRef, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import ShowSearchPreview from "./showSearchPreview";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import ExploreTabs from "./exploreTabs";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  onSearchResults: (results: any) => void;
  query:any;
  setQuery:any;
}



const SearchBar: React.FC<SearchBarProps> = ({
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

  const router=useRouter()

  const handleSearch = (e: React.KeyboardEvent) => {
    if (!query || e.key !== "Enter") return;
      e.preventDefault();
    setShowSearchResults(true);
    setShowPreview(false);
    onSearchResults(allSearchResult);
    setIsSearchFocused(false);
    addRecentSearch(query);

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('q', query);
    
    searchParams.delete('tab');
    
    router.push(`/search?${searchParams.toString()}`);

  
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
              onChange={(e) => {console.log(e.target.value);setQuery(e.target.value)}}
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

         
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

// TopTab.tsx
