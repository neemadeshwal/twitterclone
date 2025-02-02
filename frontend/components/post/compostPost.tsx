"use client";
import DivisionBar from "@/shared/divisionbar";
import React, { useEffect, useRef, useState } from "react";

import CurrentUser from "@/shared/currentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTweetMutate } from "@/graphql/mutation/tweet";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { previewFile } from "@/lib/uploadFile";
import GifContainer from "@/shared/GifContainer";
import HashtagContainer from "@/shared/HashtagContainer";

import TweetAction from "@/shared/singlePost/TweetAction";
import MediaUpload from "@/shared/singlePost/MediaUpload";
const ComposePost = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [tweetContent, setTweetContent] = useState("");
  const [openGifContainer, setOpenGifContainer] = useState(false);
  const [isEmojiTableOpen, setIsEmojiTableOpen] = useState(false);
  const [isHashTagDialogOpen, setHashTagDialog] = useState(false);
  const [hashtagPart, setHashtagPart] = useState("");
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

  async function handleImgUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const fileUrl = await previewFile(event.target.files);
      console.log(fileUrl, "fileUrl");
      if (fileUrl && fileUrl.length !== 0) {
        setFiles((prevVal) => [...prevVal, ...fileUrl]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

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

    document.addEventListener("mousedown", handleEmojiClose);

    return () => {
      document.removeEventListener("mousedown", handleEmojiClose);
    };
  }, [isEmojiTableOpen, setIsEmojiTableOpen]);

  console.log(files, "fiels");

  function handleContentChange(content: string) {
    const parts = content.split(/(\s|$)/);
    const lastPart = parts[parts.length - 1];

    if (lastPart && lastPart.startsWith("#")) {
      if (lastPart.length > 1) {
        setHashTagDialog(true);
        setHashtagPart(lastPart);
      } else {
        setHashTagDialog(false);
        setHashtagPart("");
      }
    } else {
      setHashTagDialog(false);
      setHashtagPart("");
    }
    setTweetContent(content);
  }

  useEffect(() => {
    if (tweetContent.split("#")) {
      console.log(tweetContent);
    }
  }, [tweetContent]);

  return (
    <div className="w-full relative">
      <div className="w-full p-6 px-0 sm:px-4 pb-4">
        <div className="flex  gap-2 w-full">
          <CurrentUser />
          <div className="w-full mt-2 px-2">
            <div className="relative">
              <textarea
                value={tweetContent}
                onChange={(e) => handleContentChange(e.target.value)}
                rows={2}
                className={`text-[20px] bg-transparent   outline-none border-0 w-full placeholder:text-gray-600`}
                placeholder="What is happening?!"
              ></textarea>
            </div>

            {isHashTagDialogOpen && (
              <div className="relative">
                <HashtagContainer
                  content={hashtagPart}
                  tweetContent={tweetContent}
                  setTweetContent={setTweetContent}
                  setHashTagDialog={setHashTagDialog}
                />
              </div>
            )}

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
              handleImgUpload={handleImgUpload}
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
          className="absolute border rounded-[8px] border-gray-400  mx-[10%] z-[1000]"
        >
          <div>
            <Picker
              data={data}
              onEmojiSelect={(emoji: any) =>
                setTweetContent((prevVal) => prevVal + emoji.native)
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
