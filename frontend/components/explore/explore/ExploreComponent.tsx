"use client";
import React, { useState } from "react";
import SearchInput from "../SearchInput";
import ExploreTabs from "./exploreTabs";
const ExploreComponent = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>({});

  return (
    <div>
      <SearchInput
        query={query}
        setQuery={setQuery}
        setSearchResults={setSearchResults}
      />
      <ExploreTabs />
    </div>
  );
};

export default ExploreComponent;
