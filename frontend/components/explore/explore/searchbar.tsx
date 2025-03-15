"use client";
import { useSearchquery } from "@/hooks/search";
import React, { useEffect, useRef, useState } from "react";
import ShowSearchPreview from "./showSearchPreview";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Icons } from "@/utils/icons";
import useOutsideClick from "@/shared/closeContainer";

const useRecentSearches = () => {
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
  return { addRecentSearch };
};

const SearchInput = ({
  query,
  setQuery,
  isSearchFocused,
  inputRef,
  handleSearch,
  setIsSearchFocused,
  setShowPreview,
}: {
  query: string;
  setQuery: (query: string) => void;
  isSearchFocused: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  handleSearch: (e: React.KeyboardEvent) => void;
  setIsSearchFocused: (value: boolean) => void;
  setShowPreview: (value: boolean) => void;
}) => {
  const pathname = usePathname();
  useOutsideClick(inputRef, () => setIsSearchFocused(false));
  return (
    <div
      className={`relative py-1 ${
        isSearchFocused
          ? ` ${
              pathname.startsWith("/explore") || pathname.startsWith("/search")
                ? "w-[90%] ml-10"
                : "w-full"
            } `
          : "w-full"
      }`}
    >
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          console.log(e.target.value);
          setQuery(e.target.value);
        }}
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
          <Icons.XIcon className="text-black w-6 h-6" />
        </button>
      )}

      <Icons.SearchIcon
        className={`absolute top-[30%] left-4 text-[22px] ${
          isSearchFocused ? "x-textcolor" : "gray"
        }`}
      />
    </div>
  );
};

const SearchBar = ({}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { allSearchResult, isLoading } = useSearchquery(debouncedQuery);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { addRecentSearch } = useRecentSearches();

  const urlQuery = searchParams.get("q");
  const [query, setQuery] = useState(urlQuery || "");

  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    if (isSearchFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchFocused]);

  const handleSearch = async (e: React.KeyboardEvent) => {
    if (!query || e.key !== "Enter") return;
    e.preventDefault();

    if (debouncedQuery !== query) {
      await new Promise((resolve) => setTimeout(resolve, 600)); // Wait slightly longer than debounce time
    }
    setShowPreview(false);
    setIsSearchFocused(false);

    addRecentSearch(query);

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("q", query);

    searchParams.delete("tab");

    router.push(`/search?${searchParams.toString()}`);
  };

  const handleBack = () => {
    setShowPreview(false);
    const queryParams = searchParams.get("q");

    if (queryParams) {
      setQuery(queryParams);
    }
    router.back();
  };

  return (
    <div className="relative z-[100]">
      {pathname.startsWith("/explore") ||
        (pathname.startsWith("/search") && isSearchFocused && (
          <button
            onClick={handleBack}
            className="absolute left-5 top-[12%] z-[100] p-2 hover:bg-[#5a5a5a3f] rounded-full"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        ))}

      <div className="backdrop-blur-md pt-1 bg-[#000000b0]">
        <div
          className={`${
            pathname.startsWith("/explore") || pathname.startsWith("/search")
              ? "px-12"
              : ""
          } relative`}
        >
          <SearchInput
            query={query}
            setQuery={setQuery}
            isSearchFocused={isSearchFocused}
            inputRef={inputRef}
            handleSearch={handleSearch}
            setIsSearchFocused={setIsSearchFocused}
            setShowPreview={setShowPreview}
          />
          {showPreview && (
            <ShowSearchPreview
              isSearchPreviewOpen={isSearchFocused}
              setIsSearchPreviewOpen={setShowPreview}
              allSearchResult={allSearchResult}
              setQuery={setQuery}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
