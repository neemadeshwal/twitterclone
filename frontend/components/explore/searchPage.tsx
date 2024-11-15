"use client";
import React, { useState } from "react";
import SearchBar from "./explore/searchbar";
import DivisionBar from "@/shared/divisionbar";
import PeopleTab from "./explore/peopleTab";
import TrendingTab from "./explore/TrendingTab";
import HashtagTab from "./explore/hashtagTab";
import TopTab from "./explore/topTab";

const SearchPage = () => {
  const [searchbarTab, setSearchBarTab] = useState("people");
  const [searchResultForTopTab, setSearchResultForTopTab] = useState({});

  return (
    <div>
      <div>
        <div className="sticky top-0 z-[1000]">
          <SearchBar
            searchbarTab={searchbarTab}
            setSearchBarTab={setSearchBarTab}
            setSearchResultForTopTab={setSearchResultForTopTab}
          />
          <DivisionBar type="x" />
        </div>
        <div className="h-[500vh] w-full">
          {searchbarTab === "people" && <PeopleTab />}
          {searchbarTab === "trending" && <TrendingTab />}
          {searchbarTab === "hashtag" && <HashtagTab />}
          {searchbarTab === "top" && (
            <TopTab searchResult={searchResultForTopTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
