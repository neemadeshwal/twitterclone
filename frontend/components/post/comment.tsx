"use client";
import { Comment, HashTag, Tweet } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import { formatTimeAgo, getDateTime } from "@/lib/timeStamp";
import CurrentUser from "@/shared/currentUser";
import UserProfile from "@/shared/AuthorProfile";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { BiX } from "react-icons/bi";
import { BsChat } from "react-icons/bs";
import { FaArrowLeft, FaChevronDown } from "react-icons/fa";
import { LuDot } from "react-icons/lu";
import { useCommentMutation } from "@/hooks/mutation/useCommentMutation";
import { useToast } from "@/hooks/use-toast";
import TweetAction from "@/shared/singlePost/TweetAction";
import CharacterCircle from "@/shared/CharacterCircle";
import TweetContent from "@/shared/singlePost/TweetContent";
import { Check, WandSparkles, X } from "lucide-react";
import Loading from "@/shared/loading";
import { TWEET_CHARACTER_LIMIT } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";

import { rewriteTweetWithAi } from "@/graphql/mutation/ai";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";

const instructionExamples = [
  "Make this sound more professional",
  "Complete this thought in a funny way",
  "Add some relevant hashtags",
  "Rewrite this to be more engaging",
  "Shorten this to fit the character limit",
];

const CommentComponent = ({
  tweet,
  iconColor,
  isComment,
  isParentComment,
}: {
  tweet: Tweet | Comment;
  iconColor?: string;
  isComment?: boolean;
  isParentComment?: boolean;
}) => {
  const [showDialogBox, setShowDialogBox] = useState(false);
  const { toast } = useToast();
  const [aiInstructText, setAiInstructText] = useState("");
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [aiEnhancedText, setAiEnhancedText] = useState("");
  const [isAiInstructionsActive, setIsAiInstructionsActive] = useState(false);

  const [displayAiResponse, setDisplayAiResponse] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [tweetContent, setTweetContent] = useState("");
  const [aiResponseLoading, setAiResponseLoading] = useState(false);
  const [position, setPosition] = useState(-100);
  const [loading, setLoading] = useState(false);
  const { user } = useCurrentUser();

  const { createComment } = useCommentMutation({
    onSuccess: () => {
      setTweetContent("");
      setFiles([]);
    },
  });
  console.log(position);
  const { replyOnComment } = useCommentMutation({
    onSuccess: () => {
      setTweetContent("");
      setFiles([]);
    },
  });

  const handleWithAiMutation = useMutation({
    mutationFn: rewriteTweetWithAi,
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });

  const { createTweet } = useTweetMutation({
    onSuccess: () => {
      setTweetContent("");
      setFiles([]);
    },
  });

  // Fixed animation loop
  useEffect(() => {
    let animationId: number;

    const animateShimmer = () => {
      setPosition((prevPosition) => {
        return prevPosition > 100 ? -100 : prevPosition + 1.5;
      });
      animationId = requestAnimationFrame(animateShimmer);
    };

    animationId = requestAnimationFrame(animateShimmer);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleWithAI = useCallback(async () => {
    const body = {
      tweet: tweetContent,
      instructions: aiInstructText,
    };
    setAiResponseLoading(true);
    try {
      const data = await handleWithAiMutation.mutateAsync(body);
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
  }, [tweetContent, aiInstructText, handleWithAiMutation]);

  const replyOnCommentSubmit = useCallback(async () => {
    setLoading(true);
    const body = {
      content: tweetContent,
      mediaArray: files,
      commentId: tweet.id ?? "",
    };
    try {
      const data = await replyOnComment(body);

      if (data && data.replyOnComment) {
        toast({
          description: (
            <div className="flex items-center justify-between w-full">
              <span>Your post is sent.</span>

              <a
                href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${user?.userName}/comment/${data.replyOnComment.id}`}
                className="ml-2 underline font-medium cursor-pointer hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
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
  }, [tweetContent, files, tweet.id, replyOnComment, toast, user?.userName]);

  const onSubmit = useCallback(async () => {
    setLoading(true);
    const body = {
      content: tweetContent,
      mediaArray: files,
    };
    try {
      const response = await createTweet(body);
      if (response && response.createTweet) {
        toast({
          description: (
            <div className="flex items-center justify-between w-full">
              <span>Your post is sent.</span>
              <a
                href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${user?.userName}/status/${response.createTweet?.id}`}
                className="ml-2 underline font-medium cursor-pointer hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
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
        setShowDialogBox(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setTweetContent("");
    }
  }, [tweetContent, files, createTweet, toast, user?.userName]);

  const onCommentSubmit = useCallback(async () => {
    setLoading(true);
    const body = {
      content: tweetContent,
      mediaArray: files,
      tweetId: tweet.id ?? "",
    };
    try {
      const data = await createComment(body);
      if (data && data.createComment) {
        toast({
          description: (
            <div className="flex items-center justify-between w-full">
              <span>Your post is sent.</span>
              <a
                href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${user?.userName}/comment/${data.createComment?.id}`}
                className="ml-2 underline font-medium cursor-pointer hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
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
        setShowDialogBox(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setTweetContent("");
    }
  }, [tweetContent, files, tweet.id, createComment, toast, user?.userName]);

  const handleReplyOnComment = useCallback(async () => {
    const body = {
      content: tweetContent,
      commentId: tweet.id,
      mediaArray: [],
    };
    try {
      const data = await replyOnComment(body);
      if (data && data.replyOnComment) {
        toast({
          description: (
            <div className="flex items-center justify-between w-full">
              <span>Your post is sent.</span>
              <a
                href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${tweet?.author?.userName}/comment/${data.replyOnComment.id}`}
                className="ml-2 underline font-medium cursor-pointer hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
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

      setShowDialogBox(false);
      setTweetContent("");
    } catch (error) {
      console.log(error);
    }
  }, [tweetContent, tweet.id, tweet?.author?.userName, replyOnComment, toast]);

  const handleComment = useCallback(async () => {
    const body = {
      content: tweetContent,
      tweetId: tweet.id,
      mediaArray: [],
    };

    try {
      const data = await createComment(body);
      if (data && data.createComment) {
        toast({
          description: (
            <div className="flex items-center justify-between w-full">
              <span>Your post is sent.</span>
              <a
                href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${tweet?.author?.userName}/comment/${data.createComment.id}`}
                className="ml-2 underline font-medium cursor-pointer hover:text-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
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

      setShowDialogBox(false);
      setTweetContent("");
    } catch (error) {
      console.log(error);
    }
  }, [tweetContent, tweet.id, tweet?.author?.userName, createComment, toast]);

  const getCount = useMemo(() => {
    if (!tweet) return 0;

    if (isComment) {
      return (tweet as Comment).replies?.length || 0;
    } else {
      return (tweet as Tweet).commentAuthor?.length || 0;
    }
  }, [tweet, isComment]);

  const handleCloseDialog = useCallback(() => {
    setShowDialogBox(false);
  }, []);

  const handleInstructTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setAiInstructText(e.target.value);
    },
    []
  );

  const handleSetInstruction = useCallback((instruction: string) => {
    setAiInstructText(instruction);
  }, []);

  const toggleAiInstructions = useCallback(() => {
    setIsAiInstructionsActive((prev) => !prev);
  }, []);

  const handleOpenDialog = useCallback(() => {
    setShowDialogBox(true);
  }, []);

  return (
    <div>
      <div
        onClick={handleOpenDialog}
        className={`flex gap-[2px] sm:gap-1 items-center ${
          iconColor == "white" ? "white" : "gray"
        }  text-[13px] font-[400] cursor-pointer group hover:text-blue-400  relative`}
      >
        <div className="p-2 rounded-full group-hover:bg-[#1e2034a5] ">
          <BsChat className="text-[16px] sm:text-[20px] " />
        </div>
        <p className="ml-0 pl-0 -right-[0.35rem] absolute">{getCount}</p>
      </div>
      {showDialogBox && (
        <div className="fixed top-0 left-0 w-full h-full z-[1000] dimBg flex items-center justify-center">
          <div className="bg-black max-h-[100%]  md:max-h-[90%] overflow-y-auto z-[1000] relative  md:rounded-[20px] w-full  md:w-[600px]  h-full md:h-auto md:py-6">
            <div className="overflow-y-auto">
              <div
                onClick={handleCloseDialog}
                className="absolute top-2 left-2 hidden md:block rounded-full p-1 z-50 hover:bg-[#0f0f0f] cursor-pointer"
              >
                <BiX className="text-[30px] " />
              </div>

              <div
                onClick={handleCloseDialog}
                className="absolute top-2 left-2 rounded-full p-1  md:hidden  z-50 hover:bg-[#0f0f0f] cursor-pointer"
              >
                <FaArrowLeft className="text-[20px] " strokeWidth={1} />
              </div>
              <div className="absolute top-2 md:hidden right-2 rounded-full z-50 p-1 hover:bg-[#0f0f0f] cursor-pointer">
                <button
                  onClick={isComment ? handleReplyOnComment : handleComment}
                  className="py-[0.4rem] rounded-full x-bgcolor px-6"
                >
                  Reply
                </button>
              </div>
              <div className="flex flex-col xs:gap-2 sm:gap-4">
                <div className="px-4">
                  <div>
                    <div className="  w-full   pt-20  relative  md:pt-14   flex gap-2 ">
                      <div className="flex gap-4">
                        <div className="flex  w-fit md:items-center flex-col gap-1 h-full md:justify-center  items-center ">
                          <div className=" flex items-center  flex-col gap-2">
                            <UserProfile author={tweet?.author} />
                          </div>
                          <div className="w-[2px] rounded-full h-full block flex-grow bg-[#2c2c2cb2] "></div>
                        </div>
                        <div className="w-full">
                          <div className="flex flex-col sm:flex-row items-start sm:gap-1 sm:items-center">
                            <div className="flex items-center gap-3">
                              <p className="capitalize font-[600] text-[17px] xs:text-[20px]">
                                {tweet.author?.firstName}{" "}
                                {tweet.author?.lastName}
                              </p>
                              <div className="hidden xs:flex items-center xs:text-[15px] sm:text-xl">
                                <p className=" gray font-[300]">
                                  @{tweet.author?.userName}
                                </p>
                                <p>
                                  <LuDot className="gray font-[300]" />
                                </p>

                                <p className="gray  font-[300]">
                                  {formatTimeAgo(getDateTime(tweet?.createdAt))}
                                </p>
                              </div>
                            </div>
                            <div className="flex xs:hidden  items-center sm:items-start">
                              <p className=" gray text-[15px] leading-[19px] font-[400]">
                                @{tweet.author?.userName}
                              </p>

                              <p>
                                <LuDot className="gray font-[300]" />
                              </p>

                              <p className="gray text-[14px] md:text-[16px] leading-[19px] font-[300]">
                                {formatTimeAgo(getDateTime(tweet?.createdAt))}
                              </p>
                            </div>
                          </div>
                          <div className="py-1 sm:pb-6 sm:pt-2 text-[15px] xs:text-lg">
                            {tweet?.content}
                          </div>
                          <div>
                            {tweet?.hashtags &&
                              tweet?.hashtags.length !== 0 && (
                                <div>
                                  {tweet?.hashtags.map((tag: HashTag) => {
                                    return (
                                      <span
                                        key={tag.id}
                                        className="x-textcolor sm:text-lg"
                                      >
                                        {tag.text}{" "}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                          </div>
                          {tweet?.mediaArray &&
                            tweet?.mediaArray.length !== 0 && (
                              <div className="pr-4 text-[14px] xs:text-lg sm:text-[18px] flex flex-col gap-4">
                                {tweet?.mediaArray?.map((url) => (
                                  <div key={url} className="relative break-all">
                                    {url}
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex gap-4 my-2 items-center h-10 ">
                    <div className="w-[2px] mx-[19px]  rounded-full h-full block bg-[#2c2c2cb2] "></div>
                    <div className="gray font-[500] text-[15px] xs:text-lg sm:text-xl py-1">
                      Replying to{" "}
                      <p className="x-textcolor inline">
                        @{tweet.author?.userName}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="   px-4 ">
                    <div className=" w-full">
                      <div>
                        <div className="w-full mt-2 xs:text-lg sm:text-xl px-2 flex items-start gap-4">
                          <div className="">
                            <CurrentUser user={user} />
                          </div>
                          <TweetContent
                            isRecording={isAudioActive}
                            isComment={isComment}
                            tweetContent={tweetContent}
                            isInPhotoSection={false}
                            setTweetContent={setTweetContent}
                          />
                        </div>

                        {tweetContent && (
                          <div className="  ">
                            <div className="rounded-[10px] border my-1 mb-4 border-[#44444574] px-4 py-2">
                              <div
                                onClick={toggleAiInstructions}
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
                                    onChange={handleInstructTextChange}
                                    name=""
                                    placeholder="Tell AI what to do with your text (e.g., 'Make this more professional' or 'Add some hashtags')"
                                    className="w-full px-4 outline-none focus-within:border-blue-500/70 placeholder:text-gray-700 py-2 h-[100px] resize-none overflow-auto placeholder-break-words bg-black border border-[#44444574] rounded-[5px]"
                                  />

                                  <div className="flex flex-wrap gap-2 mt-3">
                                    {instructionExamples.map((item) => {
                                      return (
                                        <div
                                          onClick={() =>
                                            handleSetInstruction(item)
                                          }
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
                                        <WandSparkles
                                          strokeWidth={1.5}
                                          size={14}
                                        />
                                        Apply AI
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {aiEnhancedText && (
                        <div className="my-4 ">
                          <div className="border border-gray-800 bg-gray-950 px-2 rounded-[10px]  overflow-hidden relative">
                            <div
                              onClick={() => setAiEnhancedText("")}
                              className="absolute right-[1.5px] top-[1.5px] cursor-pointer p-1 hover:bg-gray-900 rounded-full"
                            >
                              <X
                                strokeWidth={1}
                                size={18}
                                className="text-gray-400"
                              />
                            </div>
                            <div className="justify-between flex items-center px-4 py-3  pb-0 ">
                              <p className="font-medium text-[13px] text-gray-300">
                                Before / After
                              </p>
                              <div
                                onClick={() =>
                                  setDisplayAiResponse((prev) => !prev)
                                }
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
                                <div className="text-gray-300">
                                  {originalText}
                                </div>
                              </div>

                              <div className="border border-gray-800 rounded-[6px] p-3 bg-black">
                                <div className="text-sm text-gray-500 mb-1.5 font-medium">
                                  Instructions:
                                </div>
                                <div className="text-gray-300">
                                  {aiInstructText}
                                </div>
                              </div>

                              <div className="border border-gray-800 rounded-[6px] p-3 bg-blue-950/30 relative">
                                <div className="text-sm text-blue-500 mb-1.5 font-medium flex items-center gap-1.5">
                                  <WandSparkles size={14} strokeWidth={1.5} />
                                  AI Enhanced:
                                </div>
                                <div className="text-gray-300">
                                  {aiEnhancedText}
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
                      )}
                    </div>
                    <div>
                      <div className=" w-full">
                        <div className=" flex  justify-between pr-6">
                          <TweetAction
                            isInPhotoSection={false}
                            setTweetContent={setTweetContent}
                            setFiles={setFiles}
                            setLoading={setLoading}
                            containerType="MainPost"
                            isRecording={isAudioActive}
                            setIsRecording={setIsAudioActive}
                            tweetContent={tweetContent}
                          />
                          <div>
                            <div className="flex gap-2 items-center">
                              {tweetContent.length > 0 && (
                                <div>
                                  <CharacterCircle
                                    tweetContentLength={tweetContent.length}
                                    characterLimit={Number(
                                      TWEET_CHARACTER_LIMIT
                                    )}
                                  />
                                </div>
                              )}

                              {isComment && tweet.id ? (
                                isParentComment ? (
                                  <button
                                    onClick={replyOnCommentSubmit}
                                    className="py-2 rounded-full text-black px-4 bg-white font-bold disabled:bg-[#ffffff71] disabled:cursor-not-allowed"
                                    disabled={
                                      loading ||
                                      (files.length === 0 &&
                                        tweetContent.trim() === "")
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
                                      (files.length === 0 &&
                                        tweetContent.trim() === "")
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
                                    (files.length === 0 &&
                                      tweetContent.trim() === "")
                                  }
                                >
                                  Post
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CommentComponent);
