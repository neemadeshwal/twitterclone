"use client"
import React, { useState } from 'react'
import SearchBar from './explore/searchbar';
import DivisionBar from '@/shared/divisionbar';


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
const SearchInput = () => {
    
    const [searchbarTab, setSearchBarTab] = useState<TabType>(TABS.FORYOU);
    const [searchResults, setSearchResults] = useState<any>({});
    const [query, setQuery] = useState("");
  return (
    <div>
         <div className="sticky top-0 z-[1000]">
                <SearchBar
                query={query}
                setQuery={setQuery}
        
                  currentTab={searchbarTab}
                  onTabChange={setSearchBarTab}
                  onSearchResults={setSearchResults}
                
                />
                <DivisionBar type="x" />
              </div>
    </div>
  )
}

export default SearchInput