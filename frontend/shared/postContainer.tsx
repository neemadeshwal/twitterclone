import React, { useEffect, useRef, useState } from "react";
import {BiX } from "react-icons/bi";

import CurrentUser from "./currentUser";

import ReactDOM from "react-dom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import DivisionBar from "./divisionbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTweetMutate } from "@/graphql/mutation/tweet";

import GifContainer from "./GifContainer";
import TweetAction from "./singlePost/TweetAction";
import MediaUpload from "./singlePost/MediaUpload";
import TweetContent from "./singlePost/TweetContent";
const PostContainer = ({
  isEdit,
  editTweet,
  ref,
  setPostControlDialogOpen,
}: {
  isEdit?: boolean;
  editTweet?: any;
  ref?: any;
  setPostControlDialogOpen: any;
}) => {
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openGifContainer, setOpenGifContainer] = useState(false);
  const [isEmojiTableOpen, setIsEmojiTableOpen] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [tweetContent, setTweetContent] = useState("");
  const mutation = useMutation({
    mutationFn: createTweetMutate,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["all-tweet"] });
      setTweetContent("");
      setFiles([]);
      setIsContainerOpen(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  async function onSubmit() {
    let photoArray: string[] = [];
    let videoArray: string[] = [];
    if (files.length !== 0) {
      files.map((url) => {
        if (url.endsWith("mp4")) {
          videoArray.push(url);
        } else {
          photoArray.push(url);
        }
      });
    }
    const body = {
      content: tweetContent,
      mediaArray:files
    };
    try {
      await mutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (isContainerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isContainerOpen]);
  const emojiCloseRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEdit && editTweet) {
      if (editTweet.content) {
        setTweetContent(editTweet.content);
      }
      if (editTweet.mediaArray) {
        setFiles(editTweet.mediaArray);
      }
    
    }
  }, [isEdit, isContainerOpen]);
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

  const element = (
    <div className="fixed top-0 left-0 w-full h-full z-[100] dimBg flex items-center justify-center overflow-y-auto p-4">
      <div
        ref={ref}
        className="bg-black min-h-[50%] h-auto pb-4 rounded-[20px] z-[1000] w-full max-w-2xl relative flex flex-col"
      >
        {/* Header */}
        <div className="p-4 relative">
          <div
            className="absolute left-1 top-1 rounded-full p-1 hover:bg-[#0f0f0f] cursor-pointer"
            onClick={() => {
              setIsContainerOpen(false);
              setPostControlDialogOpen(false);
            }}
          >
            <BiX className="text-[30px]" />
          </div>
        </div>

        {/* Content */}
        <div className="">
          <div className="flex items-start gap-4 p-4 pt-4 pb-0">
            <div className="">
              <CurrentUser />
            </div>
            <div className="w-full  h-auto px-2">
              <TweetContent
                tweetContent={tweetContent}
                setTweetContent={setTweetContent}
              />

              {loading && <div>Loading....</div>}

              {/* Image Preview */}
              {files && typeof files !== "undefined" && files.length !== 0 && (
               
               <MediaUpload   files={files} setFiles={setFiles} />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 py-0 w-full">
          <DivisionBar type="x" />
          <div className="flex justify-between items-center mt-4">
            <TweetAction
              setTweetContent={setTweetContent}
              setFiles={setFiles}
              setLoading={setLoading}
            />
            <button
              onClick={onSubmit}
              className="py-2 px-4 rounded-full bg-blue-500 text-white"
            >
              {isEdit ? "Edit post" : "Post"}
            </button>
          </div>
        </div>
      </div>

      {isEmojiTableOpen && (
        <div
          ref={emojiCloseRef}
          className="absolute left-1/2 -translate-x-1/2 z-[1001]"
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji: any) =>
              setTweetContent((prevVal) => prevVal + emoji.native)
            }
          />
        </div>
      )}

      {openGifContainer && (
        <GifContainer setOpenGifContainer={setOpenGifContainer} />
      )}
    </div>
  );

  return <div>{isEdit && ReactDOM.createPortal(element, document.body)}</div>;
};

export default PostContainer;
