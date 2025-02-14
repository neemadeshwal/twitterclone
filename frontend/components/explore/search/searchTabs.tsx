"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import TopTab from "./tabs/TopTab";
import Latest from "./tabs/Latest";
import PeopleTab from "./tabs/People";
import PostTab from "./tabs/Post";
import { useSearchquery } from "@/hooks/search";
import MediaTab from "./tabs/Media";
import DivisionBar from "@/shared/divisionbar";
const SEARCHTABS = [
  { id: "top", label: "Top" },

  { id: "latest", label: "Latest" },

  { id: "people", label: "People" },

  { id: "post", label: "Post" },

  { id: "media", label: "Media" },
];

const SearchTabs = () => {
  
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(()=>{
    if(!searchParams.get("q")){
      router.replace("/explore")
    }
  },[])
  const router = useRouter();
  const query=searchParams.get("q")

  const [searchResults,setSearchResults]=useState({
    people:[],
    post:[],
    hashtag:[],
    media:[],
    latest:[]
  })
  
  const { allSearchResult,isLoading} = useSearchquery(query||"");

  

  useEffect(()=>{
   
    if(query){
      setSearchResults(allSearchResult);

    }
  },[allSearchResult,query])

  

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
  console.log(searchResults,"serachresults")
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
        <DivisionBar type="x"/>

      </div>
      {!currentTab &&query&& <TopTab searchResult={searchResults} query={query} isLoading={isLoading} />}
      {currentTab == "latest"  &&query&& (
        <Latest searchResult={searchResults} query={query} isLoading={isLoading} />
      )}
       {currentTab == "people"  && query&&(
        <PeopleTab searchResult={searchResults}  query={query} isLoading={isLoading}/>
      )}
       {currentTab == "post" && query&&(
        <PostTab searchResult={searchResults} query={query} isLoading={isLoading}/>
      )}
      {
        currentTab=="media"&&query&&(
          <MediaTab query={query} searchResult={searchResults} isLoading={isLoading}/>
        )
      }
      
    </div>
  );
};

export default SearchTabs;
