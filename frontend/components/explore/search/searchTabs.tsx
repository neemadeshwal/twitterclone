"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import TopTab from "./tabs/TopTab";
import Latest from "./tabs/Latest";
import PeopleTab from "./tabs/People";
import PostTab from "./tabs/Post";
import { useSearchquery } from "@/hooks/search";
import MediaTab from "./tabs/Media";
import DivisionBar from "@/shared/divisionbar";
import { authorType, HashTag, Tweet } from "@/graphql/types";

const SEARCHTABS = [
  { id: "top", label: "Top" },

  { id: "latest", label: "Latest" },

  { id: "people", label: "People" },

  { id: "post", label: "Post" },

  { id: "media", label: "Media" },
];

export interface SearchResultProps{
  people:authorType[];
  post:Tweet[];
  hashtag:HashTag[];
  media:Tweet[];
  latest:Tweet[];
}

const SearchTabs = () => {
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const { allSearchResult, isLoading } = useSearchquery(query || "");

  const [searchResults, setSearchResults] = useState({
    people: [],
    post: [],
    hashtag: [],
    media: [],
    latest: [],
  });

  useEffect(() => {
    if (!query) {
      router.replace("/explore");
      return;
    }
  }, []);

  useEffect(() => {
    if (query) {
      setSearchResults(allSearchResult);
    }
  }, [allSearchResult, query, router]);

  console.log(allSearchResult,"allsearch")

  const currentTab = searchParams.get("tab");

  const setTabParam = useCallback(
    (tabValue: string) => {
      const params = new URLSearchParams(searchParams);

      if (tabValue == "top") {
        params.delete("tab");
      } else if (tabValue) {
        params.set("tab", tabValue);
      } else {
        params.delete("tab");
      }
      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl);
    },
    [pathname, router, searchParams]
  );

  const renderTabContent = () => {
    if (!query) return null;

    switch (currentTab) {
      case "latest":
        return (
          <Latest
            searchResult={searchResults}
            query={query}
            isLoading={isLoading}
          />
        );
      case "people":
        return (
          <PeopleTab
            searchResult={searchResults}
            query={query}
            isLoading={isLoading}
          />
        );
      case "post":
        return (
          <PostTab
            searchResult={searchResults}
            query={query}
            isLoading={isLoading}
          />
        );
      case "media":
        return (
          <MediaTab
            query={query}
            searchResult={searchResults}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <TopTab
            searchResult={searchResults}
            query={query}
            isLoading={isLoading}
          />
        );
    }
  };

  return (
    <div>
      <div>
        <div className="flex items-center w-full">
          {SEARCHTABS.map(({ id, label }) => {
            return (
              <div
                onClick={() => setTabParam(id)}
                key={id}
                className="relative w-1/3"
              >
                <button className="py-4 px-4 w-full cursor-pointer hover:bg-[#1d1d1dbb]">
                  {label}
                </button>
                {(currentTab === `${id}` || (!currentTab && id == "top")) && (
                  <div className="absolute bottom-0 bg-blue-500 w-[50%] left-[28%] h-1 rounded-full" />
                )}
              </div>
            );
          })}
        </div>
        <DivisionBar type="x" />
      </div>
      {renderTabContent()}
    </div>
  );
};

export default SearchTabs;
