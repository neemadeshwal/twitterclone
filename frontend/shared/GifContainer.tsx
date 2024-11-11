"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { BiSearch, BiX } from "react-icons/bi";

const GifContainer = ({
  setOpenGifContainer,
}: {
  setOpenGifContainer: any;
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-[1000] dimBg flex items-center justify-center">
      <div className="bg-black rounded-[20px] z-[1000] w-[45%] min-h-[70%] h-[90%] relative ">
        <div className="z-50">
          <div
            className="absolute top-2 left-2  rounded-full cursor-pointer p-2"
            onClick={() => setOpenGifContainer(false)}
          >
            <BiX className="w-7 h-7" />
          </div>
          <div className="flex justify-center w-full ">
            <div className="flex justify-center w-[80%]  py-3 relative">
              <input
                className="rounded-full w-full border border-gray-500 bg-transparent px-12 py-2 focus:border-transparent focus:outline-none"
                id="gif"
                placeholder="search gif"
                type="text"
              />

              <div className="absolute left-4 top-[30%]    h-full">
                <BiSearch
                  style={{ strokeWidth: "1px" }}
                  className="w-6 font-[300] h-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-[200vh] bg-red-500 overflow-auto">fd;l</div>
      </div>
    </div>
  );
};

export default GifContainer;
