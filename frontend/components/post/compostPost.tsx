"use client";
import DivisionBar from "@/shared/divisionbar";
import React, { useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import CurrentUser from "@/shared/currentUser";
import TweetAction from "@/shared/singlePost/TweetAction";
import MediaUpload from "@/shared/singlePost/MediaUpload";
import TweetContent from "@/shared/singlePost/TweetContent";
import Loading from "@/shared/loading";
import { getCurrentUser } from "@/graphql/types";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";
import CharacterCircle from "@/shared/CharacterCircle";
import { TWEET_CHARACTER_LIMIT } from "@/lib/constants";
import useOutsideClick from "@/shared/closeContainer";
import { useCommentMutation } from "@/hooks/mutation/useCommentMutation";

const ComposePost = ({ user,isComment,tweetId }: { user: getCurrentUser | null ,isComment?:boolean,tweetId?:string}) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [tweetContent, setTweetContent] = useState("");
  const [isEmojiTableOpen, setIsEmojiTableOpen] = useState(false);

  const emojiCloseRef = useRef<HTMLDivElement>(null);

  useOutsideClick(emojiCloseRef, () => setIsEmojiTableOpen(false));

  const { createTweet } = useTweetMutation({
    onSuccess: () => {
      setTweetContent("");
      setFiles([]);
    },
  });

  const {createComment}=useCommentMutation({
    onSuccess:()=>{
      setTweetContent("");
      setFiles([]);
    }
  })

  async function onSubmit() {
    const body = {
      content: tweetContent,
      mediaArray: files,
    };
    try {
      await createTweet(body);
    } catch (error) {
      console.log(error);
    }
  }
  async function onCommentSubmit() {
    console.log("hello comment in ")
    console.log(tweetId)
    const body = {
      comment: tweetContent,
      mediaArray: files,
      tweetId:tweetId??""
    };
    try {
      await createComment(body);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-full relative">
      <div className="w-full p-6 px-0 sm:px-4 pb-4">
        <div className="flex  gap-2 w-full">
          <CurrentUser user={user} />
          <div className="w-full mt-2 px-2">
            <TweetContent
            isComment={isComment}
              tweetContent={tweetContent}
              setTweetContent={setTweetContent}
            />

            {loading && (
              <div className="pb-3 pl-3">
                <Loading />
              </div>
            )}

            {files.length !== 0 && (
              <MediaUpload files={files} setFiles={setFiles} />
            )}
          {!isComment&&
            <DivisionBar type="x" />
          
          }
          </div>
        </div>
        <div>
          <div className={`pl-14 flex ${isComment?"pt-0":"pt-3"} pb-0 justify-between`}>
            <TweetAction
              setTweetContent={setTweetContent}
              setFiles={setFiles}
              setLoading={setLoading}
              containerType="MainPost"
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
             
             {
              (isComment&&tweetId)?
              <button
              onClick={onCommentSubmit}
              className="py-2 rounded-full text-black px-4 bg-white font-bold disabled:bg-[#ffffff71] disabled:cursor-not-allowed"
              disabled={files.length == 0 && tweetContent.trim() == ""}
            >
              Reply
            </button>
            :
             <button
             onClick={onSubmit}
             className="py-2 rounded-full text-black px-4 bg-white font-bold disabled:bg-[#ffffff71] disabled:cursor-not-allowed"
             disabled={files.length == 0 && tweetContent.trim() == ""}
           >
            Post
           </button>
             }


             
            </div>
          </div>
        </div>
      </div>
      <DivisionBar type="x" />
      {isEmojiTableOpen && (
        <div
          ref={emojiCloseRef}
          className="absolute  rounded-[8px] shadow-[0_0_6px_rgba(255,255,255,0.6)] mx-[10%] z-[1000]"
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
    </div>
  );
};

export default ComposePost;
