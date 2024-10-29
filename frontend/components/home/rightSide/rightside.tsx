import React from "react";
import { BiSearch } from "react-icons/bi";

const RightSidebar = () => {
  return (
    <div className="">
      <div className="px-6">
        <div className="bg-black sticky top-0 py-2 ">
          <div className="relative">
            <input
              placeholder="search"
              className="w-full rounded-full px-12 py-2 bg-[#262626c0] focus:bg-black  outline-none focus:outline-[#1d9bf0] outline-1 "
            />
            <BiSearch className="absolute top-[22%] gray  left-4 text-[22px] peer-focus:text-[#1d9bf0]" />
          </div>
        </div>
        <div className="h-[200vh] text-[15px]">fdfd</div>
      </div>
    </div>
  );
};

export default RightSidebar;
