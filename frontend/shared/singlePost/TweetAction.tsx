import React, { useRef, useState } from "react";

import { previewFile } from "@/lib/uploadFile";

import GifContainer from "../GifContainer";
import EmojiTable from "../ComposePost/EmojiTable";
import ScrollLock from "../ScrollLock";
import useOutsideClick from "../closeContainer";
import { Icons } from "@/utils/icons";
import AudioRecord from "@/components/post/AudioRecord";

const TweetAction = ({
  setTweetContent,
  setFiles,
  setLoading,
  containerType,
  isInPhotoSection,
  isRecording,
  setIsRecording,
  tweetContent,
}: {
  setTweetContent: any;
  setFiles: any;
  setLoading: any;
  containerType: string;
  isInPhotoSection?: boolean;
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
  tweetContent: string;
}) => {
  const [isEmojiTableOpen, setIsEmojiTableOpen] = useState(false);
  const [openGifContainer, setOpenGifContainer] = useState(false);

  const gifContainerRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(gifContainerRef, () => setOpenGifContainer(false));

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
        <AudioRecord
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          tweetContent={tweetContent}
          setTweetContent={setTweetContent}
        />
        <div className="rounded-full p-3 hover:bg-[#081323] ">
          <label htmlFor={containerType}>
            <input
              type="file"
              id={containerType}
              multiple
              className="hidden"
              onChange={handleImgUpload}
            />
            <Icons.PhotoIcon className="text-[22px] x-textcolor " />
          </label>
        </div>
        <div
          className="rounded-full p-3 hover:bg-[#081323]"
          onClick={() => setOpenGifContainer(true)}
        >
          <Icons.GifIcon className="text-[22px] x-textcolor " />
        </div>

        <div className="rounded-full p-3 hover:bg-[#081323]">
          <Icons.RadioIcon className="text-[22px] x-textcolor " />
        </div>

        {!isInPhotoSection && (
          <div
            onClick={() => setIsEmojiTableOpen((prevVal) => !prevVal)}
            className="rounded-full p-3 hover:bg-[#081323]"
          >
            <Icons.EmojiSmile className="text-[22px] x-textcolor " />
          </div>
        )}
        {!isInPhotoSection && (
          <div className="rounded-full p-3 hover:bg-[#081323]">
            <Icons.CLock className="text-[22px] x-textcolor " />
          </div>
        )}

        <div className="rounded-full p-3 hover:bg-[#081323]">
          <Icons.Pin className="text-[22px] x-textcolor " />
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
        <div>
          <GifContainer
            gifContainerRef={gifContainerRef}
            setOpenGifContainer={setOpenGifContainer}
            setFiles={setFiles}
          />
          <ScrollLock isOpen={openGifContainer} />
        </div>
      )}
    </div>
  );
};

export default TweetAction;
