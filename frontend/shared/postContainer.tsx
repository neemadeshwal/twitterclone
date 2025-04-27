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
import { FaArrowLeft, FaChevronDown } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/user";
import { Comment, Tweet } from "@/graphql/types";
import CharacterCircle from "./CharacterCircle";
import { TWEET_CHARACTER_LIMIT } from "@/lib/constants";
import { Check, WandSparkles, X } from "lucide-react";
import Loading from "./loading";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";
import { toast } from "@/hooks/use-toast";
import { rewriteTweetWithAi } from "@/graphql/mutation/ai";
const instructionExamples = [
  "Make this sound more professional",
  "Complete this thought in a funny way",
  "Add some relevant hashtags",
  "Rewrite this to be more engaging",
  "Shorten this to fit the character limit",
];
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
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [aiInstructText, setAiInstructText] = useState("");
  const [displayAiResponse, setDisplayAiResponse] = useState(false);
  const [aiResponseLoading, setAiResponseLoading] = useState(false);
  const [isAiInstructionsActive, setIsAiInstructionsActive] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [aiEnhancedText, setAiEnhancedText] = useState("");

  const [tweetContent, setTweetContent] = useState("");
  const { user } = useCurrentUser();

  const { createTweet } = useTweetMutation({
    onSuccess: () => {
      setTweetContent("");
      setFiles([]);
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
        setAiEnhancedText("");
        setAiInstructText("");
        setOriginalText("");
        setDisplayAiResponse(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setIsContainerOpen(false);
    }
  }

  const handleWithAI = async () => {
    const body = {
      tweet: tweetContent,
      instructions: aiInstructText,
    };
    setAiResponseLoading(true);
    try {
      const data = await handleWithAiMutation.mutateAsync(body);
      console.log(data, "data");
      setOriginalText(tweetContent);
      if (data && data.rewriteTweetWithAi) {
        setAiEnhancedText(data.rewriteTweetWithAi.output);
        setTweetContent(data.rewriteTweetWithAi.output);
        setDisplayAiResponse(true);
        setIsAiInstructionsActive(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAiResponseLoading(false);
    }
  };

  useEffect(() => {
    if (!tweetContent) {
      setIsAiInstructionsActive(false);
    }
  }, [tweetContent]);
  const handleWithAiMutation = useMutation({
    mutationFn: rewriteTweetWithAi,
    onSuccess: (response) => {},
    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if (displayAiResponse && aiEnhancedText) {
      setTweetContent(aiEnhancedText);
    } else {
      setTweetContent(originalText);
    }
  }, [aiEnhancedText, displayAiResponse]);
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
                isRecording={isAudioActive}
                tweetContent={tweetContent}
                setTweetContent={setTweetContent}
              />

              {tweetContent && (
                <div className="  ">
                  <div className="rounded-[10px] border my-1 mb-4 border-[#44444574] px-4 py-2">
                    <div
                      onClick={() => setIsAiInstructionsActive((prev) => !prev)}
                      className="flex justify-between w-full items-center cursor-pointer"
                    >
                      <div className="flex text-blue-500 gap-2 items-center text-[14px]">
                        <div>
                          <WandSparkles
                            strokeWidth={1}
                            className="text-[12px]"
                          />
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
                          className="bg-blue-500/80 min-w-[120px]  mt-6  hover:bg-blue-600 text-white rounded-full px-4 py-2 text-[16px] font-medium flex items-center gap-1.5 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWithAI();
                          }}
                        >
                          {aiResponseLoading ? (
                            <>
                              <Loading small={true} /> applying ai....
                            </>
                          ) : (
                            <>
                              <WandSparkles strokeWidth={1.5} size={14} />
                              Apply AI
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {aiEnhancedText && (
                <div className="my-4 ">
                  <div className="border border-gray-800 bg-gray-950 px-2 rounded-[10px]  overflow-hidden relative">
                    <div
                      onClick={() => setAiEnhancedText("")}
                      className="absolute right-[1.5px] top-[1.5px] cursor-pointer p-1 hover:bg-gray-900 rounded-full"
                    >
                      <X strokeWidth={1} size={18} className="text-gray-400" />
                    </div>
                    <div className="justify-between flex items-center px-4 py-3  pb-0 ">
                      <p className="font-medium text-[13px] text-gray-300">
                        Before / After
                      </p>
                      <div
                        onClick={() => setDisplayAiResponse((prev) => !prev)}
                      >
                        {displayAiResponse ? (
                          <button className="bg-transparent text-[13px] hover:bg-gray-900 text-gray-300 border border-gray-700 px-3 py-1 rounded-full  transition-colors duration-200">
                            Use original
                          </button>
                        ) : (
                          <button className="bg-transparent text-[13px] hover:bg-gray-900 text-gray-300 border border-gray-700 px-3 py-1 rounded-full  transition-colors duration-200">
                            Use ai response
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="border border-gray-800 rounded-[6px] p-3 bg-black">
                        <div className="text-sm  text-gray-500 mb-1.5 font-medium">
                          Original:
                        </div>
                        <div className="text-gray-300">{originalText}</div>
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
                        <div className="text-gray-300">{aiEnhancedText}</div>
                        <div className="absolute top-3 right-3">
                          <button className="text-blue-500 hover:text-blue-400 transition-colors duration-200">
                            <Check size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
              isRecording={isAudioActive}
              setIsRecording={setIsAudioActive}
              tweetContent={tweetContent}
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
