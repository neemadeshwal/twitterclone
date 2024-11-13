"use client";
import React, { useState } from "react";
import SearchBar from "./explore/searchbar";
import DivisionBar from "@/shared/divisionbar";
import PeopleTab from "./explore/peopleTab";
import TrendingTab from "./explore/TrendingTab";
import HashtagTab from "./explore/hashtagTab";

const SearchPage = () => {
  const [searchbarTab, setSearchBarTab] = useState("people");

  return (
    <div>
      <div>
        <div className="sticky top-0">
          <SearchBar
            searchbarTab={searchbarTab}
            setSearchBarTab={setSearchBarTab}
          />
          <DivisionBar type="x" />
        </div>
        <div className="h-[500vh] w-full">
          {searchbarTab === "people" && <PeopleTab />}
          {searchbarTab === "trending" && <TrendingTab />}
          {searchbarTab === "hashtag" && <HashtagTab />}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
