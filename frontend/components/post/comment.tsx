import { getCurrentUser, Tweet } from "@/graphql/types";
import { getRandomDarkHexColor } from "@/lib/randomColor";
import CurrentUser from "@/shared/currentUser";
import DivisionBar from "@/shared/divisionbar";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import { BsChat, BsEmojiSmile } from "react-icons/bs";
import { FiMapPin } from "react-icons/fi";
import { HiOutlinePhotograph } from "react-icons/hi";
import { LuDot, LuFolderClock } from "react-icons/lu";
import { MdOutlineGifBox } from "react-icons/md";
import { RiListRadio } from "react-icons/ri";

const Comment = ({ tweet, user }: { tweet: Tweet; user: getCurrentUser }) => {
  const [showDialogBox, setShowDialogBox] = useState(false);
  const [color, setColor] = useState("");
  const [tweetContent, setTweetContent] = useState("");

  useEffect(() => {
    setColor(getRandomDarkHexColor());
  }, []);

  return (
    <div>
      <div
        onClick={() => setShowDialogBox(true)}
        className="flex gap-1 items-center gray text-[13px] font-[400] cursor-pointer"
      >
        <BsChat className="text-[20px]" />
        234k
      </div>
      {showDialogBox && (
        <div className="fixed top-0 left-0 w-full h-full z-[1000] dimBg flex items-center justify-center">
          <div className="bg-black rounded-[20px] z-[1000] w-[40%] min-h-[70%] relative p-4 pt-14 h-auto flex gap-2 ">
            <div
              className="absolute top-2 left-2 rounded-full p-1 hover:bg-[#0f0f0f] cursor-pointer"
              onClick={() => setShowDialogBox(false)}
            >
              <BiX className="text-[30px]" />
            </div>
            <div className="flex w-fit items-center flex-col gap-1 h-full justify-center  ">
              <div className="min-h-[100px] h-full flex items-center  flex-col gap-2">
                {tweet.author?.profileImgUrl ? (
                  <Image
                    src={tweet.author.profileImgUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div
                    className="rounded-full py-2 px-4 flex items-center justify-center capitalize"
                    style={{ backgroundColor: color }}
                  >
                    {tweet.author?.firstName.slice(0, 1)}
                  </div>
                )}
                <div className="w-1 h-full bg-[#2c2c2cb2] min:h-[100px]"></div>
              </div>
              <div className="py-3 pt-5">
                <CurrentUser />
              </div>
            </div>
            <div className="w-full">
              <div>
                <div className="flex gap-1 items-center mt-1">
                  <p className="capitalize font-[600] text-[17px] ">
                    {tweet.author?.firstName} {tweet.author?.lastName}
                  </p>
                  <p className="gray font-[300]">{tweet.author?.userName}</p>
                  <p>
                    <LuDot className="gray font-[300]" />
                  </p>
                  <p className="gray font-[300]">5h</p>
                </div>
                <div className="py-3">{tweet?.content}</div>
                <div className="gray font-[500] text-[13px] py-1">
                  Replying to{" "}
                  <p className="x-textcolor inline">{tweet.author?.userName}</p>
                </div>
              </div>
              <div className="py-2 pt-4 w-full">
                <div className="w-full mt-2 px-2">
                  <textarea
                    value={tweetContent}
                    onChange={(e) => setTweetContent(e.target.value)}
                    rows={3}
                    autoFocus
                    className="text-[20px] bg-transparent resize-none outline-none border-0 w-full placeholder:text-gray-600"
                    placeholder="Post your reply"
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 w-full">
              <div className=" flex  justify-between pr-6">
                <div className="flex gap-2 ">
                  <div className="rounded-full p-2 hover:bg-[#081323] ">
                    <HiOutlinePhotograph className="text-[22px] x-textcolor " />
                  </div>
                  <div className="rounded-full p-2 hover:bg-[#081323]">
                    <MdOutlineGifBox className="text-[22px] x-textcolor " />
                  </div>
                  <div className="rounded-full p-2 hover:bg-[#081323]">
                    <RiListRadio className="text-[22px] x-textcolor " />
                  </div>
                  <div className="rounded-full p-2 hover:bg-[#081323]">
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
                    // onClick={onSubmit}
                    className="py-2 rounded-full x-bgcolor px-4"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comment;