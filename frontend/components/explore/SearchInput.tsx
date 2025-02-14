"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "./explore/searchbar";
import DivisionBar from "@/shared/divisionbar";


const SearchInput = () => {


  

  return (
    <div>
      <div className="sticky top-0 z-[1000]">
        <SearchBar
        />
        <DivisionBar type="x" />
      </div>
    </div>
  );
};

export default SearchInput;
