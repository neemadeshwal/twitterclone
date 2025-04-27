"use client";

import { Bookmarks, Comment, Tweet } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import React, { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

interface SavePostProps {
  singleTweet: Tweet | Comment;
  isComment?: boolean;
  handleSaveComment?: () => void;
  handleSaveTweet?: () => void;
  savePost: boolean;
}

const SavePost: React.FC<SavePostProps> = ({
  singleTweet,
  isComment,
  handleSaveComment,
  handleSaveTweet,
  savePost,
}) => {
  const user = useCurrentUser();

  useEffect(() => {
    if (!singleTweet || !user) {
      return;
    }

    let isSaved;
    if (isComment) {
      isSaved = singleTweet.savedPost?.some(
        (post: any) => post.commentId === singleTweet.id
      );
    }
  }, [singleTweet, user]);

  return (
    <div className="flex gap-1 items-center text-[13px] font-[400]">
      <div
        onClick={isComment ? handleSaveComment : handleSaveTweet}
        className="flex gap-1 items-center cursor-pointer text-[13px] font-[400]"
      >
        {savePost ? (
          <div className="p-2 text-blue-500">
            <FaBookmark className="text-[16px] sm:text-[20px] text-blue-500" />
          </div>
        ) : (
          <div className="p-2 rounded-full gray hover:text-blue-500 hover:bg-[#1e2034a5]">
            <FaRegBookmark className="text-[16px] gray sm:text-[20px]" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavePost;
