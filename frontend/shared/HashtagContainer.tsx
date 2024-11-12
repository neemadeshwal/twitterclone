"use client";
import { useGetAllHashTag } from "@/hooks/tweet";
import React, { useEffect, useRef } from "react";

const HashtagContainer = ({
  content,
  setHashTagDialog,
}: {
  content: string;
  setHashTagDialog: any;
}) => {
  const { allHashtag } = useGetAllHashTag();
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
  if (allHashtag?.length === 0) {
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
        {allHashtag?.map((tag) => {
          return (
            <div
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
