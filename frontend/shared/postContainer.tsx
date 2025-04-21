import React, { useEffect, useRef, useState } from "react";
import { BiX } from "react-icons/bi";

import CurrentUser from "./currentUser";

import ReactDOM from "react-dom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import DivisionBar from "./divisionbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTweetMutate, editTweetMutate } from "@/graphql/mutation/tweet";

import GifContainer from "./GifContainer";
import TweetAction from "./singlePost/TweetAction";
import MediaUpload from "./singlePost/MediaUpload";
import TweetContent from "./singlePost/TweetContent";
import { FaArrowLeft } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/user";
import { Comment, Tweet } from "@/graphql/types";
import CharacterCircle from "./CharacterCircle";
import { TWEET_CHARACTER_LIMIT } from "@/lib/constants";
const PostContainer = ({
  isEdit,
  editTweet,
  ref,
  setPostControlDialogOpen,
  isContainerOpen,
  setIsContainerOpen,
}: {
  isEdit?: boolean;
  editTweet?: Tweet | Comment;
  ref?: React.RefObject<HTMLDivElement>;
  setPostControlDialogOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isContainerOpen: boolean;
  setIsContainerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openGifContainer, setOpenGifContainer] = useState(false);
  const [isEmojiTableOpen, setIsEmojiTableOpen] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [tweetContent, setTweetContent] = useState("");
  const { user } = useCurrentUser();
  const mutation = useMutation({
    mutationFn: createTweetMutate,
    onSuccess: (response) => {
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

  const editMutation = useMutation({
    mutationFn: editTweetMutate,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["all-tweet"] });
      setIsContainerOpen(false);
      setPostControlDialogOpen && setPostControlDialogOpen(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function onEdit() {
    const body = {
      content: tweetContent,
      mediaArray: files,
      tweetId: editTweet!.id,
    };
    try {
      await editMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }
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
    <div className="fixed top-0 left-0 w-full h-full z-[10000] dimBg flex items-center justify-center overflow-y-auto md:p-4">
      <div
        ref={ref}
        className="bg-black w-full h-full md:h-auto py-10  pb-4 md:rounded-[20px] z-[1000]  md:max-w-2xl relative flex flex-col justify-between"
      >
        {/* Header */}
        <div
          className="absolute left-1  hidden md:block top-2 rounded-full p-1 hover:bg-[#0f0f0f] cursor-pointer"
          onClick={() => {
            setIsContainerOpen(false);
            setPostControlDialogOpen && setPostControlDialogOpen(false);
          }}
        >
          <BiX className="text-[30px]" />
        </div>
        <div
          onClick={() => setIsContainerOpen(false)}
          className="absolute top-2 left-2 rounded-full p-1  md:hidden  z-50 hover:bg-[#0f0f0f] cursor-pointer"
        >
          <FaArrowLeft className="text-[20px] " strokeWidth={1} />
        </div>
        {isEdit ? (
          <div className="absolute top-2 md:hidden right-2 rounded-full z-50 p-1 hover:bg-[#0f0f0f] cursor-pointer">
            <button
              onClick={onEdit}
              className="py-[0.4rem] rounded-full x-bgcolor px-6"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="absolute top-2 md:hidden right-2 rounded-full z-50 p-1 hover:bg-[#0f0f0f] cursor-pointer">
            <button
              onClick={onSubmit}
              className="py-[0.4rem] rounded-full x-bgcolor px-6"
            >
              Reply
            </button>
          </div>
        )}

        {/* Content */}
        <div className="h-full">
          <div className="flex items-start gap-4 p-4 pt-4 pb-2 md:pb-0">
            <div className="">
              <CurrentUser user={user} />
            </div>
            <div className="w-full pt-1  h-auto px-2">
              <TweetContent
                tweetContent={tweetContent}
                setTweetContent={setTweetContent}
              />

              {loading && <div>Loading....</div>}

              {/* Image Preview */}
              {files && typeof files !== "undefined" && files.length !== 0 && (
                <MediaUpload files={files} setFiles={setFiles} />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 py-0 pt-6 w-full">
          <DivisionBar type="x" />
          <div className="flex justify-between items-center mt-4">
            <TweetAction
              setTweetContent={setTweetContent}
              setFiles={setFiles}
              setLoading={setLoading}
              containerType="PostDialog"
            />
            <div className="flex gap-2 items-center">
              {tweetContent.length > 0 && (
                <div>
                  <CharacterCircle
                    tweetContentLength={tweetContent.length}
                    characterLimit={Number(TWEET_CHARACTER_LIMIT)}
                  />
                </div>
              )}
            </div>
            {isEdit ? (
              <button
                onClick={onEdit}
                className="py-2 px-4 hidden md:inline-block rounded-full bg-blue-500 text-white"
              >
                Edit post
              </button>
            ) : (
              <button
                onClick={onSubmit}
                className="py-2 px-4 hidden md:inline-block rounded-full bg-blue-500 text-white"
              >
                Post
              </button>
            )}
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
        <GifContainer
          gifContainerRef={ref!}
          setOpenGifContainer={setOpenGifContainer}
        />
      )}
    </div>
  );

  return (
    <div>
      {isContainerOpen && ReactDOM.createPortal(element, document.body)}
    </div>
  );
};

export default PostContainer;
