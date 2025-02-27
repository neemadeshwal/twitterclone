"use client";
import React, { useRef, useState } from "react";
import { RiShare2Line } from "react-icons/ri";
import { AiOutlineLink } from "react-icons/ai";
import useOutsideClick from "./closeContainer";
import { DrawerTrigger } from "@/components/ui/drawer";
import PortalContainerWrapper from "./PortalContainerWrapper";
import DrawDialog from "./DrawDialog";
import { toast } from "@/hooks/use-toast";

const SharePost = ({
  link,
  iconColor,
}: {
  link: string;
  iconColor?: string;
}) => {
  const [openShareContainer, setOpenShareContainer] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const shareContainerRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    setOpenShareContainer(false);

    const showToast = () => {
    toast({
      description: (
        <div className="flex items-center justify-between w-full">
          Copied to clipboard
        </div>
      ),
      className:
        "bg-blue-500 text-[16px] font-[500] text-white border bottom-0 sm:bottom-0 md:bottom-0 border-gray-700 rounded-[10px] shadow-[0 -0.4px 0px rgba(255,255,255,0.5)]",
    });
  }
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          setIsLinkCopied(true);
          showToast()
          setTimeout(() => setIsLinkCopied(false), 2000);
        })
        .catch((error) => {
          console.log(error, "failed to copy ");
          toast({
            variant: "destructive",
            description: "Failed to copy to clipboard",
          });
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
      showToast()

      setTimeout(() => setIsLinkCopied(false), 2000);
    }
  };

  const handleShare = () => {
    setOpenShareContainer(false);
    navigator.share({
      title: "Check out this post.",
      text: "Hey checkout this post.",
      url: link,
    });
  };
  useOutsideClick(shareContainerRef, () => setOpenShareContainer(false));

  const drawerTrigger = (
    <div
      className={`md:hidden flex gap-[2px] sm:gap-1 hover:bg-[#1e2034a5] hover:text-blue-400  items-center ${
        iconColor == "white" ? "white" : "gray"
      }  text-[13px] font-[400] rounded-full p-2`}
    >
      <RiShare2Line className="text-[16px] sm:text-[20px]" />
    </div>
  );

  const drawerComp = (
    <div ref={shareContainerRef} className="absolute z-50 top-0 w-full">
      <div className="rounded-[15px] p-4 flex  w-full min-h-[100px] h-auto  bg-black">
        <div className="flex flex-col ">
          <div
            onClick={handleCopyLink}
            className="flex items-center gap-2 py-3 px-3"
          >
            <p>
              <AiOutlineLink className="text-[20px]" />
            </p>
            <p className="text-[16px] font-[600]">Copy link</p>
          </div>
          <div
            onClick={handleShare}
            className="flex items-center gap-2  py-3 px-3"
          >
            <p>
              <RiShare2Line className="text-[20px]" />
            </p>
            <p className="text-[16px] font-[600]">Share post via ...</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-50">
      <div className="">
        <div
          onClick={() => setOpenShareContainer(true)}
          className={`hidden md:flex gap-[2px] sm:gap-1 hover:bg-[#1e2034a5] hover:text-blue-400  items-center ${
            iconColor == "white" ? "white" : "gray"
          }  text-[13px] font-[400] rounded-full p-2`}
        >
          <RiShare2Line className="text-[16px] sm:text-[20px]" />
        </div>
        <DrawDialog drawerTrigger={drawerTrigger} drawerComp={drawerComp} />
      </div>
      {openShareContainer && (
        <div
          ref={shareContainerRef}
          className="absolute z-[1000] top-0 right-0"
        >
          <div
            style={{
              boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
            }}
            className="rounded-[15px] w-[230px] z-[1000] min-h-[100px] z h-auto py-3 bg-black"
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
