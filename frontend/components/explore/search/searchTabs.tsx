"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import TopTab from "./tabs/TopTab";
import Latest from "./tabs/Latest";
import PeopleTab from "./tabs/People";
import PostTab from "./tabs/Post";

const SEARCHTABS = [
  { id: "top", label: "Top" },

  { id: "latest", label: "Latest" },

  { id: "people", label: "People" },

  { id: "post", label: "Post" },

  { id: "media", label: "Media" },
];

const SearchTabs = ({ query, searchResults }: any) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentTab = searchParams.get("tab");

  const setTabParam = (tabValue: string) => {
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
  };
  return (
    <div>
      <div className="flex items-center w-full">
        {SEARCHTABS.map(({ id, label }) => {
          return (
            <div
              onClick={() => setTabParam(id)}
              key={id}
              className="relative w-1/3"
            >
              <button className="py-4 px-4 w-full hover:bg-[#1d1d1dbb]">
                {label}
              </button>
              {(currentTab === `${id}` || (!currentTab && id == "top")) && (
                <div className="absolute bottom-0 bg-blue-500 w-[50%] left-[28%] h-1 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
      {!currentTab && <TopTab searchResult={searchResults} query={query} />}
      {currentTab == "latest" && searchResults && (
        <Latest tweetList={searchResults.latest} query={query} />
      )}
       {currentTab == "people"  && (
        <PeopleTab userList={searchResults.people}  query={query} />
      )}
       {currentTab == "post"  && (
        <PostTab allTweet={searchResults.post} query={query} />
      )}
      
    </div>
  );
};

export default SearchTabs;
