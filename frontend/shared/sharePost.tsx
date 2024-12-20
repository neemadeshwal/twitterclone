"use client";
import React, { useRef, useState } from "react";
import { RiShare2Line } from "react-icons/ri";
import { AiOutlineLink } from "react-icons/ai";
import useOutsideClick from "./closeContainer";

const SharePost = ({ link }: { link: string }) => {
  const [openShareContainer, setOpenShareContainer] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const shareContainerRef = useRef<HTMLDivElement>(null);
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          setIsLinkCopied(true);
          setTimeout(() => setIsLinkCopied(false), 2000);
        })
        .catch((error) => {
          console.log(error, "failed to copy ");
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    }
  };

  const handleShare = () => {
    navigator.share({
      title: "Check out this post.",
      text: "Hey checkout this post.",
      url: link,
    });
  };
  useOutsideClick(shareContainerRef, () => setOpenShareContainer(false));
  return (
    <div className="relative z-50">
      <div className="">
        <div
          onClick={() => setOpenShareContainer(true)}
          className="flex gap-1 hover:bg-[#1e2034a5] hover:text-blue-400  items-center gray text-[13px] font-[400] rounded-full p-2"
        >
          <RiShare2Line className="text-[20px]" />
        </div>
      </div>
      {openShareContainer && (
        <div ref={shareContainerRef} className="absolute z-50 top-0">
          <div
            style={{
              boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
            }}
            className="rounded-[15px] w-[230px] min-h-[100px] h-auto py-3 bg-black"
          >
            <div className="flex flex-col ">
              <div
                onClick={handleCopyLink}
                className="flex items-center gap-2 hover-bg py-3 px-3"
              >
                <p>
                  <AiOutlineLink className="text-[20px]" />
                </p>
                <p className="text-[16px] font-[600]">Copy link</p>
              </div>
              <div
                onClick={handleShare}
                className="flex items-center gap-2 hover-bg py-3 px-3"
              >
                <p>
                  <RiShare2Line className="text-[20px]" />
                </p>
                <p className="text-[16px] font-[600]">Share post via ...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharePost;
