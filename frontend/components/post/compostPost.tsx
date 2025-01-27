"use client";
import DivisionBar from "@/shared/divisionbar";
import React, { useEffect, useRef, useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlineGifBox } from "react-icons/md";
import { RiListRadio } from "react-icons/ri";
import { BsEmojiSmile } from "react-icons/bs";
import { LuFolderClock } from "react-icons/lu";
import { FiMapPin } from "react-icons/fi";
import CurrentUser from "@/shared/currentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTweetMutate } from "@/graphql/mutation/tweet";
import { uploadFile } from "@/graphql/mutation/uploadFile";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { previewFile } from "@/lib/uploadFile";
import Image from "next/image";
import { BiChevronLeft, BiChevronRight, BiX } from "react-icons/bi";
import GifContainer from "@/shared/GifContainer";
import HashtagContainer from "@/shared/HashtagContainer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
const ComposePost = () => {
  const queryClient = useQueryClient();
  const [showRightChevron, setShowRightChevron] = useState(false);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
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
      photoArray,
      videoArray,
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

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (dir: string) => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const scrollLeft = scrollRef.current.scrollLeft;
      console.log(scrollWidth - clientWidth, "minus effect");
      const scrollAmount = 250 + 16;
      const maxScrollLeft = scrollWidth - clientWidth;

      if (dir === "right") {
        scrollRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
        if (scrollLeft + scrollAmount >= maxScrollLeft) {
          setShowRightChevron(false);
        } else {
          setShowRightChevron(true);
        }
      } else {
        scrollRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
        if (scrollRef.current.scrollLeft <= 0) {
          setShowLeftChevron(false); // At the start of the scroll area
        } else {
          setShowLeftChevron(true); // Not at the start
        }
        if (scrollRef.current.scrollLeft + clientWidth < scrollWidth) {
          setShowRightChevron(true); // Show right chevron if we are not at the end
        }
      }

      console.log(clientWidth, "cleintwidht");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollWidth = scrollRef.current.scrollWidth;
        const clientWidth = scrollRef.current.clientWidth;
        const scrollLeft = scrollRef.current.scrollLeft;
        console.log(scrollWidth);

        setShowRightChevron(scrollLeft + clientWidth < scrollWidth);

        setShowLeftChevron(scrollLeft > 0);
      }
    };

    if (scrollRef.current) {
      console.log("hey");
      scrollRef.current.addEventListener("scroll", handleScroll);

      // Initial check
      handleScroll();
    }

    // Clean up event listener
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [files, scrollRef]);

  const deletePreviewPhotos = async (deleteUrl: string) => {
    setFiles((prevVal) => prevVal.filter((url: string) => url !== deleteUrl));
  };
  const renderContent = (content: string) => {
    const parts = content.split(/(#\w+)/g);
    return (
      <div className="flex ">
        {parts.map((part, index) => {
          if (part.startsWith("#")) {
            return (
              <span key={index} className="text-blue-500">
                {part}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
        {isBlinking && (
          <span className="h-full border-l-2 border-white animate-pulse">
            &nbsp;
          </span>
        )}
      </div>
    );
  };

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

  
  const [isBlinking, setIsBlinking] = useState(true);

  // useEffect(() => {
  //   const blinkInterval = setInterval(() => {
  //     setIsBlinking(prev => !prev);
  //   }, 500); // Blink every 500ms

  //   return () => clearInterval(blinkInterval);
  // }, []);

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
            {/* <div className="absolute top-0 flex gap-0 left-0 z-[10000] text-[20px]">
            
              {renderContent(tweetContent)}
              
              </div> */}

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
              <div ref={scrollRef}>
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {files.map((url: string) => {
                      return (
                        <CarouselItem
                          key={url}
                          className="relative   basis-1/2"
                        >
                          <div className="rounded-[20px] py-3 flex aspect-square  items-center justify-center  ">
                            {url.endsWith(".mp4") ? (
                              <div className="rounded-[20px] relative">
                                <video
                                  controls
                                  width="250"
                                  height="250"
                                  loop
                                  className="w-full h-full rounded-[20px] object-cover"
                                  muted
                                >
                                  <source src={url} type="video/mp4" />
                                </video>

                                <BiX
                                  onClick={() => deletePreviewPhotos(url)}
                                  className="absolute bg-black/40 text-white w-7 h-7 hover:bg-black/50 cursor-pointer rounded-full right-3 top-3"
                                />
                              </div>
                            ) : (
                              <div className="rounded-[20px] relative h-full">
                                <Image
                                  src={url}
                                  alt=""
                                  width={500}
                                  height={500}
                                  className="w-full h-full rounded-[20px] object-cover"
                                />
                                <div>
                                  <BiX
                                    onClick={() => deletePreviewPhotos(url)}
                                    className="absolute bg-[#232323b5] hover:bg-[#2323237d] text-white w-7 h-7 cursor-pointer rounded-full right-3 top-3"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>

                  {/* Previous button */}
                  <CarouselPrevious className="absolute bg-[#232323b5] hover:bg-[#2323237d] hover:text-white rounded-full border-0 cursor-pointer p-2 left-0 top-[50%]" />

                  {/* Next button */}
                  <CarouselNext className="absolute bg-[#232323b5] hover:bg-[#2323237d] hover:text-white border-0 rounded-full cursor-pointer p-2 right-0 top-[50%]" />
                </Carousel>
              </div>
            )}

            <DivisionBar type="x" />
          </div>
        </div>
        <div>
          <div className="pl-14 flex pt-3 pb-0 justify-between">
            <div className="flex gap-2 ">
              <div className="rounded-full p-2 hover:bg-[#081323] ">
                <label htmlFor="file">
                  <input
                    type="file"
                    id="file"
                    multiple
                    className="hidden"
                    onChange={handleImgUpload}
                  />
                  <HiOutlinePhotograph className="text-[22px] x-textcolor " />
                </label>
              </div>
              <div
                className="rounded-full p-2 hover:bg-[#081323]"
                onClick={() => setOpenGifContainer(true)}
              >
                <MdOutlineGifBox className="text-[22px] x-textcolor " />
              </div>

              <div className="rounded-full p-2 hover:bg-[#081323]">
                <RiListRadio className="text-[22px] x-textcolor " />
              </div>

              <div
                onClick={() => setIsEmojiTableOpen((prevVal) => !prevVal)}
                className="rounded-full p-2 hover:bg-[#081323]"
              >
                <BsEmojiSmile className="text-[22px] x-textcolor " />
              </div>

              <div className="rounded-full p-2 hover:bg-[#081323]">
                <LuFolderClock className="text-[22px] x-textcolor " />
              </div>
              <div className="rounded-full p-2 hover:bg-[#081323]">
                <FiMapPin className="text-[22px] x-textcolor " />
              </div>
            </div>
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
