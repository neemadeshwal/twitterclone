"use client";
import { toggleBookmarkTweet } from "@/graphql/mutation/bookmark";
import { Bookmarks, Tweet } from "@/graphql/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const SavePost = ({
  singleTweet,
  user,
  iconColor,
}: {
  iconColor?: string;
  user: any;
  singleTweet: any;
}) => {
  const queryClient = useQueryClient();
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

  console.log(iconColor, "iconColor");
  async function handleSaveBookmark() {
    console.log("heello");
    console.log(singleTweet, "singletweet");
    setSaveBookmark((prevVal) => !prevVal);
    if (!singleTweet || !singleTweet.id) {
      return;
    }
    console.log("he hey");
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
    if (!singleTweet) {
      return;
    }
    if (singleTweet.savedPost && user) {
      setSaveBookmark(
        singleTweet.savedPost.some(
          (post: Bookmarks) => post.tweetId === singleTweet.id
        )
      );
    }
  }, [singleTweet, user]);
  return (
    <div className="flex gap-1 items-center  text-[13px] font-[400]">
      <div
        onClick={handleSaveBookmark}
        className={`flex gap-1 items-center cursor-pointer  text-[13px] ${
          iconColor == "white" ? "white" : "gray"
        } font-[400]`}
      >
        {saveBookmark ? (
          <FaBookmark className="text-[16px] sm:text-[20px] text-blue-500" />
        ) : (
          <FaRegBookmark
            className={`text-[16px] sm:text-[20px] ${
              iconColor == "white" ? "white" : "gray"
            } hover:text-blue-500`}
          />
        )}
      </div>
    </div>
  );
};

export default SavePost;
