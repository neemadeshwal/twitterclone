"use client";
import React, { useState } from "react";
import SearchBar from "./explore/searchbar";
import DivisionBar from "@/shared/divisionbar";
import PeopleTab from "./explore/tabs/peopleTab";
import TrendingTab from "./explore/tabs/TrendingTab";
import HashtagTab from "./explore/tabs/hashtagTab";
import TopTab from "./explore/tabs/TopTab";
import ForYou from "./explore/tabs/ForYou";
import Media from "./explore/tabs/Media";

export const TABS = {
  PEOPLE: "people",
  TRENDING: "trending",
  HASHTAG: "hashtag",
  POST: "post",
  TOP: "top",
  FORYOU: "forYou",
  MEDIA: "media",
  LATEST:"latest"
} as const;

type TabType = (typeof TABS)[keyof typeof TABS];

const SearchPage = () => {
  const [searchbarTab, setSearchBarTab] = useState<TabType>(TABS.FORYOU);
  const [searchResults, setSearchResults] = useState<any>({});

  return (
    <div>
      <div className="sticky top-0 z-[1000]">
        <SearchBar
          currentTab={searchbarTab}
          onTabChange={setSearchBarTab}
          onSearchResults={setSearchResults}
        
        />
        <DivisionBar type="x" />
      </div>
      <div className="min-h-screen w-full">
        {searchbarTab === TABS.PEOPLE && <PeopleTab />}
        {searchbarTab === TABS.TRENDING && <TrendingTab />}
        {searchbarTab === TABS.HASHTAG && <HashtagTab />}
        {searchbarTab === TABS.POST && <PeopleTab />}
        {searchbarTab === TABS.TOP && <TopTab searchResult={searchResults} />}
        {searchbarTab === TABS.FORYOU && <ForYou   />}
        {searchbarTab === TABS.MEDIA && <Media />}
      </div>
    </div>
  );
};

export default SearchPage;
