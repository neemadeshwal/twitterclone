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
import { toast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/user";

const ComposePost = ({
  user,
  isComment,
  tweetId,
  isParentComment,
}: {
  user: getCurrentUser | null;
  isComment?: boolean;
  tweetId?: string;
  isParentComment?: boolean;
}) => {
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

  const { createComment } = useCommentMutation({
    onSuccess: () => {
      setTweetContent("");
      setFiles([]);
    },
  });

  const { replyOnComment } = useCommentMutation({
    onSuccess: () => {
      setTweetContent("");
      setFiles([]);
    },
  });

  async function replyOnCommentSubmit() {
    setLoading(true);
    const body = {
      content: tweetContent,
      mediaArray: files,
      commentId: tweetId ?? "",
    };
    try {
      const data = await replyOnComment(body);
      console.log(data, "dataf");
      toast({
        description: (
          <div className="flex items-center justify-between w-full">
            <span>Your post is sent.</span>
            <a
              href={`http://localhost:5000/${user.userName}/comment/${tweet?.id}`} // Replace with your actual post view URL
              className="ml-2 underline font-medium cursor-pointer hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation(); // Prevents the toast from being dismissed when clicking the link
              }}
            >
              View
            </a>
          </div>
        ),
        className:
          "bg-black text-white border bottom-0 sm:bottom-0 md:bottom-0 border-gray-700 rounded-[10px] shadow-[0 -0.4px 0px rgba(255,255,255,0.5)]",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit() {
    setLoading(true);
    const body = {
      content: tweetContent,
      mediaArray: files,
    };
    try {
      await createTweet(body);
      toast({
        description: (
          <div className="flex items-center justify-between w-full">
            <span>Your post is sent.</span>
            <a
              href={`http://localhost:5000/${user?.userName}/status/${tweet?.id}`} // Replace with your actual post view URL
              className="ml-2 underline font-medium cursor-pointer hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation(); // Prevents the toast from being dismissed when clicking the link
              }}
            >
              View
            </a>
          </div>
        ),
        className:
          "bg-black text-white border bottom-0 sm:bottom-0 md:bottom-0 border-gray-700 rounded-[10px] shadow-[0 -0.4px 0px rgba(255,255,255,0.5)]",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function onCommentSubmit() {
    setLoading(true);
    const body = {
      content: tweetContent,
      mediaArray: files,
      tweetId: tweetId ?? "",
    };
    try {
      await createComment(body);
      toast({
        description: (
          <div className="flex items-center justify-between w-full">
            <span>Your post is sent.</span>
            <a
              href={`http://localhost:5000/${user?.userName}/comment/${tweet?.id}`} // Replace with your actual post view URL
              className="ml-2 underline font-medium cursor-pointer hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation(); // Prevents the toast from being dismissed when clicking the link
              }}
            >
              View
            </a>
          </div>
        ),
        className:
          "bg-black text-white border bottom-0 sm:bottom-0 md:bottom-0 border-gray-700 rounded-[10px] shadow-[0 -0.4px 0px rgba(255,255,255,0.5)]",
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full relative">
      <div className="w-full p-6 px-0 sm:px-4 pb-4">
        <div className="flex gap-2 w-full">
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
            {!isComment && <DivisionBar type="x" />}
          </div>
        </div>
        <div>
          <div
            className={`pl-14 flex ${
              isComment ? "pt-0" : "pt-3"
            } pb-0 justify-between`}
          >
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

              {isComment && tweetId ? (
                isParentComment ? (
                  <button
                    onClick={replyOnCommentSubmit}
                    className="py-2 rounded-full text-black px-4 bg-white font-bold disabled:bg-[#ffffff71] disabled:cursor-not-allowed"
                    disabled={
                      loading ||
                      (files.length === 0 && tweetContent.trim() === "")
                    }
                  >
                    Reply
                  </button>
                ) : (
                  <button
                    onClick={onCommentSubmit}
                    className="py-2 rounded-full text-black px-4 bg-white font-bold disabled:bg-[#ffffff71] disabled:cursor-not-allowed"
                    disabled={
                      loading ||
                      (files.length === 0 && tweetContent.trim() === "")
                    }
                  >
                    Reply
                  </button>
                )
              ) : (
                <button
                  onClick={onSubmit}
                  className="py-2 rounded-full text-black px-4 bg-white font-bold disabled:bg-[#ffffff71] disabled:cursor-not-allowed"
                  disabled={
                    loading ||
                    (files.length === 0 && tweetContent.trim() === "")
                  }
                >
                  Post
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <DivisionBar type="x" />
      {isEmojiTableOpen && (
        <div
          ref={emojiCloseRef}
          className="absolute rounded-[8px] shadow-[0_0_6px_rgba(255,255,255,0.6)] mx-[10%] z-[1000]"
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
