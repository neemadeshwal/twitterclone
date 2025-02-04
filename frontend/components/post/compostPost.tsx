"use client";
import DivisionBar from "@/shared/divisionbar";
import React, { useEffect, useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import CurrentUser from "@/shared/currentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTweetMutate } from "@/graphql/mutation/tweet";
import GifContainer from "@/shared/GifContainer";
import TweetAction from "@/shared/singlePost/TweetAction";
import MediaUpload from "@/shared/singlePost/MediaUpload";
import TweetContent from "@/shared/singlePost/TweetContent";
const ComposePost = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [tweetContent, setTweetContent] = useState("");
  const [openGifContainer, setOpenGifContainer] = useState(false);
  const [isEmojiTableOpen, setIsEmojiTableOpen] = useState(false);
  const emojiCloseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEmojiClose = (event: MouseEvent) => {
      if (
        emojiCloseRef.current &&
        !emojiCloseRef.current.contains(event.target as Node)
      ) {
        console.log("hey");
        setIsEmojiTableOpen(false);
      }
    };
    if (isEmojiTableOpen) {
      document.addEventListener("mousedown", handleEmojiClose);
    } else {
      document.removeEventListener("mousedown", handleEmojiClose);
    }

    return () => {
      document.removeEventListener("mousedown", handleEmojiClose);
    };
  }, [isEmojiTableOpen, setIsEmojiTableOpen]);

  const mutation = useMutation({
    mutationFn: createTweetMutate,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["all-tweet"] });
      setTweetContent("");
      setFiles([]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function onSubmit() {
    const body = {
      content: tweetContent,
      mediaArray: files,
    };
    try {
      await mutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full relative">
      <div className="w-full p-6 px-0 sm:px-4 pb-4">
        <div className="flex  gap-2 w-full">
          <CurrentUser />
          <div className="w-full mt-2 px-2">
            <TweetContent
              tweetContent={tweetContent}
              setTweetContent={setTweetContent}
            />

            {loading && <div>Loading....</div>}

            {files && typeof files !== "undefined" && files.length !== 0 && (
              <MediaUpload files={files} setFiles={setFiles} />
            )}

            <DivisionBar type="x" />
          </div>
        </div>
        <div>
          <div className="pl-14 flex pt-3 pb-0 justify-between">
            <TweetAction
              setTweetContent={setTweetContent}
              setFiles={setFiles}
              setLoading={setLoading}
              containerType="MainPost"
            />
            <div>
              <button
                onClick={onSubmit}
                className="py-2 rounded-full x-bgcolor px-4"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
      <DivisionBar type="x" />
      {isEmojiTableOpen && (
        <div
          ref={emojiCloseRef}
          className="absolute border rounded-[8px] border-gray-400 mx-[10%] z-[1000]"
        >
          <div>
            <Picker
              data={data}
              onEmojiSelect={(emoji: any) =>
                setTweetContent((prevVal: string) => prevVal + emoji.native)
              }
            />
          </div>
        </div>
      )}
      {openGifContainer && (
        <GifContainer
          setOpenGifContainer={setOpenGifContainer}
          setFiles={setFiles}
        />
      )}
    </div>
  );
};

export default ComposePost;
