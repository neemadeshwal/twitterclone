"use client";
import PostContainer from "@/shared/postContainer";
import { Icons } from "@/utils/icons";
import React, { useState } from "react";

const PostButton = () => {
  const [isContainerOpen, setIsContainerOpen] = useState(false);

  return (
    <div>
      <div className="">
        <div
          onClick={() => setIsContainerOpen(true)}
          className="p-2 bg-white text-black w-fit flex fullWidth rounded-full my-2 cursor-pointer"
        >
          <div className="show-feather">
            <Icons.Feather className="text-[28px]" />
          </div>
          <p className="text-center hidden showPostName w-full justify-center items-center font-[700] text-[18px] showPost">
            Post
          </p>
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

export default PostButton;
