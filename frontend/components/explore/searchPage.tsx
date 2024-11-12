import React from "react";
import SearchBar from "./explore/searchbar";
import DivisionBar from "@/shared/divisionbar";

const SearchPage = () => {
  return (
    <div>
      <div>
        <div className="sticky top-0">
          <SearchBar />
          <DivisionBar type="x" />
        </div>
        <div className="h-[500vh] w-full">fkldjfkladjflaksd hello</div>
      </div>
    </div>
  );
};

export default SearchPage;
