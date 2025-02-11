"use client";
import { toggleBookmarkTweet } from "@/graphql/mutation/bookmark";
import { Bookmarks, Tweet } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const SavePost = ({
  singleTweet,
}: {
  singleTweet: any;
}) => {
  const queryClient = useQueryClient();
  const user = useCurrentUser();
  const [saveBookmark, setSaveBookmark] = useState(false);
  
  const saveBookmarkMutation = useMutation({
    mutationFn: toggleBookmarkTweet,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["all-bookmark"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  console.log(saveBookmark,"savebookmark")

  async function handleSaveBookmark() {
    if (!singleTweet || !singleTweet.id) {
      return;
    }

    setSaveBookmark((prevVal) => !prevVal);

    const body = {
      tweetId: singleTweet.id,
    };

    try {
      await saveBookmarkMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!singleTweet || !user) {
      return;
    }
    const isSaved = singleTweet.savedPost?.some(
      (post: Bookmarks) => post.tweetId === singleTweet.id
    );
    setSaveBookmark(isSaved);
  }, []);

  return (
    <div className="flex gap-1 items-center text-[13px] font-[400]">
      <div
        onClick={handleSaveBookmark}  
        className={`flex gap-1 items-center cursor-pointer text-[13px] font-[400] `}
      >
        {saveBookmark ? (
            <div className="p-2 text-blue-500 ">

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
