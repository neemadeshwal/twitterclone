"use client";
import {
  toggleBookmarkComment,
  toggleBookmarkTweet,
} from "@/graphql/mutation/bookmark";
import { Bookmarks, Tweet } from "@/graphql/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const SaveComment = ({ singleComment, user }: any) => {
  const queryClient = useQueryClient();
  const [saveBookmark, setSaveBookmark] = useState(false);
  const saveBookmarkMutation = useMutation({
    mutationFn: toggleBookmarkComment,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["single-comment"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  async function handleSaveBookmark() {
    console.log("heello");
    console.log(singleComment, "singletweet");
    setSaveBookmark((prevVal) => !prevVal);
    if (!singleComment || !singleComment.id) {
      return;
    }
    console.log("he hey");
    const body = {
      commentId: singleComment.id,
    };
    try {
      await saveBookmarkMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("hello");
    if (!singleComment) {
      console.log("commentexist");
      return;
    }
    console.log("just checkiang");
    console.log(singleComment, "savedpost arr");

    if (singleComment.savedPost && user) {
      setSaveBookmark(
        singleComment.savedPost.some(
          (comment: Bookmarks) => comment.commentId === singleComment.id
        )
      );
    }
  }, [singleComment, user]);
  return (
    <div className="flex gap-1 items-center gray text-[13px] font-[400]">
      <div
        onClick={handleSaveBookmark}
        className="flex gap-1 items-center cursor-pointer gray text-[13px] font-[400]"
      >
        {saveBookmark ? (
          <FaBookmark className="text-[20px] text-blue-500" />
        ) : (
          <FaRegBookmark className="text-[20px] gray hover:text-blue-500" />
        )}
      </div>
    </div>
  );
};

export default SaveComment;
