"use client";

import { Bookmarks, Comment, Tweet } from "@/graphql/types";
import { useCommentMutation } from "@/hooks/mutation/useCommentMutation";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";
import { toast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/user";
import React, { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

interface SavePostProps {
  singleTweet: Tweet | Comment;
  isComment?: boolean;
}

const SavePost: React.FC<SavePostProps> = ({ singleTweet, isComment }) => {
  const user = useCurrentUser();
  const [saveBookmark, setSaveBookmark] = useState(false);

  const { saveComment } = useCommentMutation({
    onError: () => {
      // Revert the bookmark state on error
      setSaveBookmark((prev) => !prev);
    },
  });

  const { saveTweet } = useTweetMutation({
    onError: () => {
      // Revert the bookmark state on error
      setSaveBookmark((prev) => !prev);
    },
  });

  async function handleSaveComment() {
    if (!singleTweet || !singleTweet.id) {
      return;
    }

    setSaveBookmark((prevVal) => !prevVal);

    const body = {
      commentId: singleTweet.id,
    };

    try {
      await saveComment(body);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSaveTweet() {
    if (!singleTweet || !singleTweet.id) {
      return;
    }

    setSaveBookmark((prevVal) => !prevVal);

    const body = {
      tweetId: singleTweet.id,
    };

    try {
      await saveTweet(body);
      toast({
        description: (
          <div className="flex items-center  justify-between w-full">
            Added to bookmarks
          </div>
        ),
        className:
          "bg-blue-500 text-[16px] font-[500] text-white border bottom-0 sm:bottom-0 md:bottom-0 border-gray-700 rounded-[10px] shadow-[0 -0.4px 0px rgba(255,255,255,0.5)]",
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!singleTweet || !user) {
      return;
    }

    let isSaved;
    if (isComment) {
      isSaved = singleTweet.savedPost?.some(
        (post: any) => post.commentId === singleTweet.id
      );
    } else {
      isSaved = singleTweet.savedPost?.some(
        (post: any) => post.tweetId === singleTweet.id
      );
    }

    setSaveBookmark(!!isSaved);
  }, [singleTweet, user]);

  return (
    <div className="flex gap-1 items-center text-[13px] font-[400]">
      <div
        onClick={isComment ? handleSaveComment : handleSaveTweet}
        className="flex gap-1 items-center cursor-pointer text-[13px] font-[400]"
      >
        {saveBookmark ? (
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
