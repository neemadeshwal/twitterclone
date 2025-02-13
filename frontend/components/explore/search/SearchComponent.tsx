"use client"
import React, { useState } from 'react'
import SearchInput from '../SearchInput'
import SearchTabs from './searchTabs'

const SearchComponent = () => {
  const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any>({});
  
console.log(query,"query")
  return (
    <div>
        <SearchInput query={query} setQuery={setQuery} setSearchResults={setSearchResults}/>
        <SearchTabs searchResults={searchResults} query={query}/>
    </div>
  )
}

export default SearchComponent