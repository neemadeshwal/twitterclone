"use client";
import DivisionBar from "@/shared/divisionbar";
import React, { useRef, useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import CurrentUser from "@/shared/currentUser";
import TweetAction from "@/shared/singlePost/TweetAction";
import MediaUpload from "@/shared/singlePost/MediaUpload";
import TweetContent from "@/shared/singlePost/TweetContent";
import { getCurrentUser } from "@/graphql/types";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";
import CharacterCircle from "@/shared/CharacterCircle";
import { TWEET_CHARACTER_LIMIT } from "@/lib/constants";
import useOutsideClick from "@/shared/closeContainer";
import { useCommentMutation } from "@/hooks/mutation/useCommentMutation";
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/utils/icons";
import { FiType } from "react-icons/fi";
import { VscWand } from "react-icons/vsc";
import { FaChevronDown, FaMagic, FaMicrophone } from "react-icons/fa";
import AudioRecord from "./AudioRecord";
import { Check, WandSparkles, X } from "lucide-react";
interface EmojiSelect {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string;
}

const instructionExamples = [
  "Make this sound more professional",
  "Complete this thought in a funny way",
  "Add some relevant hashtags",
  "Rewrite this to be more engaging",
  "Shorten this to fit the character limit",
];

const ComposePost = ({
  user,
  isComment,
  tweetId,
  isParentComment,
  isInPhotoSection,
  isPhotoInputFocused,
  userNameInPhoto,
}: {
  user: getCurrentUser | null;
  isComment?: boolean;
  tweetId?: string;
  isParentComment?: boolean;
  isInPhotoSection?: boolean;
  isPhotoInputFocused?: boolean;
  userNameInPhoto?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [tweetContent, setTweetContent] = useState("");
  const [isEmojiTableOpen, setIsEmojiTableOpen] = useState(false);
  const [isAiInstructionsActive, setIsAiInstructionsActive] = useState(false);
  const emojiCloseRef = useRef<HTMLDivElement>(null);
  const [aiInstructText, setAiInstructText] = useState("");
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [aiEnhancedText, setAiEnhancedText] = useState("");

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
      if (data && data.replyOnComment) {
        toast({
          description: (
            <div className="flex items-center justify-between w-full">
              <span>Your post is sent.</span>

              <a
                href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${user?.userName}/comment/${data.replyOnComment.id}`} // Replace with your actual post view URL
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
      }
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
      const response = await createTweet(body);
      console.log(response, "response");
      if (response && response.createTweet) {
        toast({
          description: (
            <div className="flex items-center justify-between w-full">
              <span>Your post is sent.</span>
              <a
                href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${user?.userName}/status/${response.createTweet?.id}`} // Replace with your actual post view URL
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
      }
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
      console.log("commemt");
      const data = await createComment(body);
      if (data && data.createComment) {
        toast({
          description: (
            <div className="flex items-center justify-between w-full">
              <span>Your post is sent.</span>
              <a
                href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${user?.userName}/comment/${data.createComment?.id}`} // Replace with your actual post view URL
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
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full relative">
      <div
        className={`w-full ${!isInPhotoSection && "p-6 pb-4"} px-0 sm:px-4 `}
      >
        {isInPhotoSection && isPhotoInputFocused && (
          <div className="gray mt-4 mb-2 px-2">
            Replying to{" "}
            <span className="text-[#1d9bf0]">@{userNameInPhoto}</span>
          </div>
        )}
        <div className="flex gap-2 w-full">
          <div className="flex flex-col items-center gap-8">
            {!isInPhotoSection && <CurrentUser user={user} />}

            <AudioRecord
              isRecording={isAudioActive}
              setIsRecording={setIsAudioActive}
              tweetContent={tweetContent}
              setTweetContent={setTweetContent}
            />
          </div>

          <div className="w-full mt-2 px-2">
            <TweetContent
              isRecording={isAudioActive}
              isComment={isComment}
              tweetContent={tweetContent}
              isInPhotoSection={isInPhotoSection}
              setTweetContent={setTweetContent}
            />
            <div className="  ">
              <div className="rounded-[10px] border my-1 mb-4 border-[#44444574] px-4 py-2">
                <div
                  onClick={() => setIsAiInstructionsActive((prev) => !prev)}
                  className="flex justify-between w-full items-center cursor-pointer"
                >
                  <div className="flex text-blue-500 gap-2 items-center text-[14px]">
                    <div>
                      <WandSparkles strokeWidth={1} className="text-[12px]" />
                    </div>
                    <div>AI Instructions</div>
                  </div>
                  <div>
                    <FaChevronDown
                      strokeWidth={1}
                      className={`text-blue-500 ${
                        isAiInstructionsActive ? "rotate-180" : ""
                      } text-[12px] w-[15px] h-[15px] transition-all ease-in-out duration-300`}
                    />
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all ease-in-out duration-500 ${
                    isAiInstructionsActive
                      ? "max-h-[400px] opacity-100 mt-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-2">
                    <textarea
                      value={aiInstructText}
                      onChange={(e) => setAiInstructText(e.target.value)}
                      name=""
                      placeholder="Tell AI what to do with your text (e.g., 'Make this more professional' or 'Add some hashtags')"
                      className="w-full px-4 outline-none focus-within:border-blue-500/70 placeholder:text-gray-700 py-2 h-[100px] resize-none overflow-auto placeholder-break-words bg-black border border-[#44444574] rounded-[5px]"
                    />

                    <div className="flex flex-wrap gap-2 mt-3">
                      {instructionExamples.map((item) => {
                        return (
                          <div
                            onClick={() => setAiInstructText(item)}
                            key={item}
                            className="rounded-full cursor-pointer text-[14px] px-3 py-1 w-fit border border-blue-500 text-blue-500 hover:bg-blue-950/50 transition-colors duration-200"
                          >
                            {item}
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="bg-blue-500/80  mt-6  hover:bg-blue-600 text-white rounded-full px-4 py-2 text-[16px] font-medium flex items-center gap-1.5 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent toggling the drawer
                        // Add your AI application logic here
                      }}
                    >
                      <WandSparkles strokeWidth={1.5} size={14} />
                      Apply AI
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-4 ">
              <div className="border border-gray-800 bg-gray-950 px-2 rounded-[10px]  overflow-hidden relative">
                <div className="absolute right-[1.5px] top-[1.5px] cursor-pointer p-1 hover:bg-gray-900 rounded-full">
                  <X strokeWidth={1} size={18} className="text-gray-400" />
                </div>
                <div className="justify-between flex items-center px-4 py-3  pb-0 ">
                  <p className="font-medium text-[13px] text-gray-300">
                    Before / After
                  </p>
                  <button className="bg-transparent text-[13px] hover:bg-gray-900 text-gray-300 border border-gray-700 px-3 py-1 rounded-full  transition-colors duration-200">
                    Use original
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div className="border border-gray-800 rounded-[6px] p-3 bg-black">
                    <div className="text-sm  text-gray-500 mb-1.5 font-medium">
                      Original:
                    </div>
                    <div className="text-gray-300">{tweetContent}</div>
                  </div>

                  <div className="border border-gray-800 rounded-[6px] p-3 bg-black">
                    <div className="text-sm text-gray-500 mb-1.5 font-medium">
                      Instructions:
                    </div>
                    <div className="text-gray-300">{aiInstructText}</div>
                  </div>

                  <div className="border border-gray-800 rounded-[6px] p-3 bg-blue-950/30 relative">
                    <div className="text-sm text-blue-500 mb-1.5 font-medium flex items-center gap-1.5">
                      <WandSparkles size={14} strokeWidth={1.5} />
                      AI Enhanced:
                    </div>
                    <div className="text-gray-300">
                      hello let me check out this is going{aiEnhancedText}
                    </div>
                    <div className="absolute top-3 right-3">
                      <button className="text-blue-500 hover:text-blue-400 transition-colors duration-200">
                        <Check size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isInPhotoSection && isPhotoInputFocused && (
              <div className="border-[1.2px] mb-2 border-[#1d9bf0] border-b w-full "></div>
            )}

            {loading && <div className="pb-3 pl-3"></div>}

            {files.length !== 0 && (
              <MediaUpload files={files} setFiles={setFiles} />
            )}
            {!isComment && <DivisionBar type="x" />}
          </div>

          {isPhotoInputFocused && (
            <div className="absolute right-1">
              <Icons.Expand className=" text-[#1d9bf0] text-[25px]" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ">
          <div
            className={` w-full ${isInPhotoSection ? "pl-0" : "pl-6"} ${
              isInPhotoSection
                ? isPhotoInputFocused
                  ? "inline-block"
                  : "hidden"
                : "inline-block"
            } flex ${isComment ? "pt-0" : "pt-3"} pb-0 justify-between`}
          >
            <TweetAction
              isInPhotoSection={isInPhotoSection}
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
      {!isPhotoInputFocused && <DivisionBar type="x" />}
      {isEmojiTableOpen && (
        <div
          ref={emojiCloseRef}
          className="absolute rounded-[8px] shadow-[0_0_6px_rgba(255,255,255,0.6)] mx-[10%] z-[1000]"
        >
          <div>
            <Picker
              data={data}
              onEmojiSelect={(emoji: EmojiSelect) =>
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
