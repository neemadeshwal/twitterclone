import React, { useEffect, useRef, useState } from "react";
import { BiChevronLeft, BiChevronRight, BiX } from "react-icons/bi";
import { BsEmojiSmile, BsFeather } from "react-icons/bs";
import CurrentUser from "./currentUser";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdEditDocument, MdOutlineGifBox } from "react-icons/md";
import { RiListRadio } from "react-icons/ri";
import { LuDot, LuFolderClock } from "react-icons/lu";
import { FiMapPin } from "react-icons/fi";
import ReactDOM from "react-dom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import DivisionBar from "./divisionbar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTweetMutate } from "@/graphql/mutation/tweet";
import { previewFile } from "@/lib/uploadFile";
import HashtagContainer from "./HashtagContainer";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import GifContainer from "./GifContainer";
const PostContainer = ({isEdit,editTweet}:{isEdit?:boolean,editTweet?:any}) => {
  const [showRightChevron, setShowRightChevron] = useState(false);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openGifContainer, setOpenGifContainer] = useState(false);
  const [isEmojiTableOpen, setIsEmojiTableOpen] = useState(false);
  const [isHashTagDialogOpen, setHashTagDialog] = useState(false);
  const [hashtagPart, setHashtagPart] = useState("");
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

  useEffect(()=>{
    if(isEdit&&editTweet){

      if(editTweet.content){
        setTweetContent(editTweet.content)
      }
      if(editTweet.photoArray){
        setFiles((prevVal)=>[...prevVal,...editTweet.photoArray]);
      }
      if(editTweet.videoArray){
        setFiles((prevVal)=>[...prevVal,...editTweet.videoArray]);

      }

    }
  },[isEdit,isContainerOpen])
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
      <div className="bg-black min-h-[50%] h-auto pb-10 rounded-[20px] z-[1000] w-full max-w-2xl relative flex flex-col">
        {/* Header */}
        <div className="p-4 relative">
          <div
            className="absolute left-2 top-2 rounded-full p-1 hover:bg-[#0f0f0f] cursor-pointer"
            onClick={() => setIsContainerOpen(false)}
          >
            <BiX className="text-[30px]" />
          </div>
        </div>

        {/* Content */}
        <div className="">
          <div className="flex items-start gap-4 p-4 pt-8 pb-0">
            <div className="">
              <CurrentUser />
            </div>
          <div className="w-full  h-auto px-2">
            
            <textarea
              value={tweetContent}
              onChange={(e) => handleContentChange(e.target.value)}
              autoFocus
              className="w-full text-[20px] bg-transparent resize-none outline-none border-0 placeholder:text-gray-600"
              placeholder="What is happening?"
            />
      

          {isHashTagDialogOpen && (
            <div className="mt-2">
              <HashtagContainer
                content={hashtagPart}
                tweetContent={tweetContent}
                setTweetContent={setTweetContent}
                setHashTagDialog={setHashTagDialog}
              />
            </div>
          )}

          {loading && <div>Loading....</div>}

          {/* Image Preview */}
          {files && typeof files !== "undefined" && files.length !== 0 && (
              <div ref={scrollRef} className="h-auto pb-14">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {files.map((url: string,index:number) => {
                      return (
                        <CarouselItem
                          key={url+index}
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

          </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 absolute bottom-4 w-full">
          <DivisionBar type="x" />
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2">
              <label className="rounded-full p-2 hover:bg-[#081323] cursor-pointer">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleImgUpload}
                />
                <HiOutlinePhotograph className="text-[22px] x-textcolor" />
              </label>
              <button
                className="rounded-full p-2 hover:bg-[#081323]"
                onClick={() => setOpenGifContainer(true)}
              >
                <MdOutlineGifBox className="text-[22px] x-textcolor" />
              </button>
              <button className="rounded-full p-2 hover:bg-[#081323]">
                <RiListRadio className="text-[22px] x-textcolor" />
              </button>
              <button
                className="rounded-full p-2 hover:bg-[#081323]"
                onClick={() => setIsEmojiTableOpen(!isEmojiTableOpen)}
              >
                <BsEmojiSmile className="text-[22px] x-textcolor" />
              </button>
              <button className="rounded-full p-2 hover:bg-[#081323]">
                <LuFolderClock className="text-[22px] x-textcolor" />
              </button>
              <button className="rounded-full p-2 hover:bg-[#081323]">
                <FiMapPin className="text-[22px] x-textcolor" />
              </button>
            </div>
            <button
              onClick={onSubmit}
              className="py-2 px-4 rounded-full bg-blue-500 text-white"
            >
              {
                isEdit?"Edit post":"Post"
              }
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

  
  return (
    <div>
      <div
        onClick={() => setIsContainerOpen(true)}
        className={`p-2 ${isEdit?"text-white bg-black":"bg-white text-black"} w-fit flex fullWidth rounded-full my-2 cursor-pointer`}
      >
        {
          isEdit?
          <div>
             <button  className="flex gap-3 items-center font-[600]">
              <MdEditDocument className="font-[600] text-[17px]" />
              Edit
            </button>
          </div>
          :
          <div>
 <div className="show-feather">
          <BsFeather className="text-[28px]" />
        </div>
        <p className="text-center hidden showPostName w-full justify-center items-center font-[700] text-[18px] showPost">
          Post
        </p>
          </div>
        }
       
      </div>

      {isContainerOpen && ReactDOM.createPortal(element, document.body)}
    </div>
  );
};

export default PostContainer;
