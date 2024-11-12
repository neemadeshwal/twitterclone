"use client";
import { useGetAllHashTag } from "@/hooks/tweet";
import React, { useEffect, useRef, useState } from "react";

const HashtagContainer = ({
  content,
  setHashTagDialog,
  tweetContent,
  setTweetContent,
}: {
  content: string;
  setHashTagDialog: any;
  tweetContent: string;
  setTweetContent: any;
}) => {
  const { allHashtag } = useGetAllHashTag();
  const [filterHashtagList, setFilterHashtagList] = useState(allHashtag);
  console.log(allHashtag, "allhashtag");

  const hashtagRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handlePostDialog = (event: MouseEvent) => {
      if (
        hashtagRef.current &&
        !hashtagRef.current.contains(event.target as Node)
      ) {
        setHashTagDialog(false);
      }
    };
    document.addEventListener("mousedown", handlePostDialog);

    return () => {
      document.removeEventListener("mousedown", handlePostDialog);
    };
  }, [setHashTagDialog]);

  useEffect(() => {
    if (filterHashtagList?.length !== 0) {
      setFilterHashtagList((prevVal) => {
        return prevVal?.filter((item) => {
          return item.text.toLowerCase().includes(content.toLowerCase());
        });
      });
    }
  }, [content]);

  const handleTweetChange = (tag: string) => {
    setTweetContent((prevVal: string) => prevVal.replace(content, tag));
    setHashTagDialog(false);
  };
  if (
    (filterHashtagList && filterHashtagList.length === 0) ||
    (allHashtag && allHashtag.length === 0)
  ) {
    return;
  }
  return (
    <div
      ref={hashtagRef}
      className="absolute top-[10%] left-[10%] w-full h-full z-[1000]"
    >
      <div
        style={{
          boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
        }}
        className="bg-black rounded-[5px] z-[100]  flex gap-2 flex-col  w-[350px] min-h-[30%] h-[200px] py-2 overflow-auto"
      >
        {filterHashtagList?.map((tag, index) => {
          return (
            <div
              onClick={() => handleTweetChange(tag.text)}
              style={{
                backgroundColor: index === 0 ? "#262626c0" : "hover-bg",
              }}
              className="py-3 px-4 w-full hover-bg cursor-pointer"
              key={tag.id}
            >
              {tag.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HashtagContainer;
