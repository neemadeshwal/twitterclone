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
const ComposePost = () => {
  const queryClient = useQueryClient();
  const [tweetContent, setTweetContent] = useState("");
  const [isEmojiTableOpen, setIsEmojiTableOpen] = useState(false);
  const mutation = useMutation({
    mutationFn: createTweetMutate,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["all-tweet"] });
      setTweetContent("");
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const uploadFileMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: (response: any) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  async function onSubmit() {
    const body = {
      content: tweetContent,
    };
    try {
      await mutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleImgUpload(event: any) {
    const files = Array.from(event.target.files);
    console.log(files, "formatter files");
    const body = {
      files: event.target.files,
    };
    try {
      await uploadFileMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
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
      if (isEmojiTableOpen) {
        document.addEventListener("click", handleEmojiClose);
      }

      return () => {
        document.removeEventListener("click", handleEmojiClose);
      };
    };
  }, [isEmojiTableOpen]);

  return (
    <div className="w-full relative">
      <div className="w-full p-6 px-4 pb-4">
        <div className="flex gap-2 w-full">
          <CurrentUser />
          <div className="w-full mt-2 px-2">
            <textarea
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
              rows={2}
              className="text-[20px] bg-transparent outline-none border-0 w-full placeholder:text-gray-600"
              placeholder="What is happening?!"
            ></textarea>
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
              <div className="rounded-full p-2 hover:bg-[#081323]">
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
      <div className="sticky mx-auto top-12 px-[10%] h-[600px]">
        {isEmojiTableOpen && (
          // <EmojiPicker
          //   className="emoji-black"
          //   style={{ width: "300px", height: "400px" }}
          // />
          <div ref={emojiCloseRef}>
            <Picker
              data={data}
              onEmojiSelect={(emoji: any) =>
                setTweetContent((prevVal) => prevVal + emoji.native)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ComposePost;
