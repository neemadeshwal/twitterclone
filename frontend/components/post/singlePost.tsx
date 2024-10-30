"use client";
import React, { useEffect, useState } from "react";
import { BsChat } from "react-icons/bs";
import { CiBookmark, CiHeart } from "react-icons/ci";
import { FaDotCircle } from "react-icons/fa";
import {
  IoEllipseOutline,
  IoEllipsisHorizontal,
  IoShareOutline,
} from "react-icons/io5";
import { ImLoop } from "react-icons/im";
import { LuDot, LuRepeat2 } from "react-icons/lu";
import DivisionBar from "@/shared/divisionbar";
import Image from "next/image";
import { useAllTweet } from "@/hooks/tweet";
import { Tweet } from "@/graphql/types";
import { getRandomDarkHexColor } from "@/lib/randomColor";

const SinglePost = ({ tweet }: { tweet: Tweet }) => {
  const [color, setColor] = useState("");

  useEffect(() => {
    setColor(getRandomDarkHexColor());
  }, []);
  return (
    <div className="w-full py-3 px-2">
      <div className="flex gap-4 w-full">
        <div>
          {tweet.author?.profileImgUrl ? (
            <Image
              src={tweet?.author?.profileImgUrl}
              alt=""
              width={40}
              height={40}
            />
          ) : (
            <div
              className="rounded-full py-2 px-4 flex items-center justify-center capitalize"
              style={{ backgroundColor: color }}
            >
              {tweet.author?.firstName.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="w-full px-4">
          <div className="flex justify-between w-full ">
            <div className="flex gap-1 items-center">
              <p className="capitalize font-[600] text-[17px]">
                {tweet.author?.firstName}
              </p>
              <p className="gray font-[300]">{tweet.author?.userName}</p>
              <p>
                <LuDot className="gray font-[300]" />
              </p>
              <p className="gray font-[300]">5h</p>
            </div>
            <div>
              <IoEllipsisHorizontal className="gray" />
            </div>
          </div>
          <div>{tweet?.content}</div>
          <div className="py-2">
            <Image
              alt=""
              width={200}
              height={200}
              src="/img.jpg"
              className="w-full rounded-[10px]"
            />
          </div>
          <div className="flex justify-between py-2 pt-3 pb-4">
            <div className="flex gap-1 items-center gray text-[13px] font-[400]">
              <BsChat className="text-[20px] " />
              234k
            </div>
            <div className="flex gap-1 items-center gray text-[13px] font-[400]">
              <LuRepeat2 className="text-[20px] " />
              34k
            </div>
            <div className="flex gap-1 items-center gray text-[13px] font-[400]">
              <CiHeart className="text-[20px] " />
              2344k
            </div>
            <div className="flex gap-1 items-center gray text-[13px] font-[400]">
              <IoShareOutline className="text-[20px] " />
            </div>
            <div className="flex gap-1 items-center gray text-[13px] font-[400]">
              <CiBookmark className="text-[20px] " />
            </div>
          </div>
        </div>
      </div>
      <DivisionBar type="x" />
    </div>
  );
};

export default SinglePost;
