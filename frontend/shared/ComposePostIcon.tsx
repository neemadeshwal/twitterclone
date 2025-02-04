"use client";
import React, { useState } from "react";
import { BsFeather } from "react-icons/bs";
import PostContainer from "./postContainer";

const ComposePostIcon = () => {
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  return (
    <div className="z-[1000]">
      <div
        onClick={() => setIsContainerOpen(true)}
        className="p-3 fixed bottom-16 right-12 z-[1000] bg-white text-black w-fit flex fullWidth rounded-full my-2 cursor-pointer"
      >
        <div className="show-feather">
          <BsFeather className="text-[28px]" />
        </div>
      
      </div>
      {isContainerOpen && (
        <PostContainer
          isContainerOpen={isContainerOpen}
          setIsContainerOpen={setIsContainerOpen}
        />
      )}
    </div>
  );
};

export default ComposePostIcon;
