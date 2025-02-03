import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { HiOutlinePhotograph } from "react-icons/hi";
import { LuFolderClock } from "react-icons/lu";
import { MdOutlineGifBox } from "react-icons/md";
import { RiListRadio } from "react-icons/ri";

import { previewFile } from "@/lib/uploadFile";

import GifContainer from "../GifContainer";
import EmojiTable from "../ComposePost/EmojiTable";

const TweetAction = ({
  setTweetContent,
  setFiles,
  setLoading,
}: {
  setTweetContent: any;
  setFiles: any;
  setLoading: any;
}) => {
  const [isEmojiTableOpen, setIsEmojiTableOpen] = useState(false);
  const [openGifContainer, setOpenGifContainer] = useState(false);
  async function handleImgUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const fileUrl = await previewFile(event.target.files);
      console.log(fileUrl, "fileUrl");
      if (fileUrl && fileUrl.length !== 0) {
        setFiles((prevVal: string[]) => [...prevVal, ...fileUrl]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
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
      {isEmojiTableOpen && (
        <EmojiTable
          setTweetContent={setTweetContent}
          isEmojiTableOpen={isEmojiTableOpen}
          setIsEmojiTableOpen={setIsEmojiTableOpen}
        />
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

export default TweetAction;
