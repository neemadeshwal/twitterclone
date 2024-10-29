import DivisionBar from "@/shared/divisionbar";
import React from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlineGifBox } from "react-icons/md";
import { RiListRadio } from "react-icons/ri";
import { BsEmojiSmile } from "react-icons/bs";
import { LuFolderClock } from "react-icons/lu";
import { FiMapPin } from "react-icons/fi";
const ComposePost = () => {
  return (
    <div className="w-full ">
      <div className="w-full p-6 px-4 pb-4">
        <div className="flex gap-2 w-full">
          <div className="bg-cyan-700 rounded-full p-2 h-fit px-4">N</div>
          <div className="w-full mt-2 px-2">
            <textarea
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
              <button className="py-2 rounded-full x-bgcolor px-4">Post</button>
            </div>
          </div>
        </div>
      </div>
      <DivisionBar type="x" />
    </div>
  );
};

export default ComposePost;
