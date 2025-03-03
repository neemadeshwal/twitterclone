"use client";
import MoreContainer from "@/shared/moreContainer";
import { Icons } from "@/utils/icons";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { PiBookmarkSimple } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";

const MoreContainerTrigger = () => {

  return (
    <div className="z-[100] relative">
      <Popover >
        <PopoverTrigger>
          {" "}
          <div
            className="p-2 more-bottom-height mt-2 rounded-full fullWidth w-fit hover:bg-[#1d1d1dbb] flex items-center justify-center cursor-pointer fixPosition px-width"
          >
            <Icons.CircleDots className="text-[28px]" />
            <span className="hidden showIcon capitalize">more</span>
          </div>
        </PopoverTrigger>
        <PopoverContent
          style={{
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
          }}
          className="rounded-[15px] w-[300px] absolute left-[-5px] top-[-1rem] min-h-[150px] h-auto  px-0 text-white border-0  bg-black"

        >
            <div>
              <div className="flex flex-col z-50  ">
                <div className="flex items-center gap-2 hover-bg py-3 px-3">
                  <Link href="/bookmarks" className="flex gap-2 items-center">
                    <p>
                      <PiBookmarkSimple className="text-[20px]" />
                    </p>
                    <p className="text-[16px] font-[600]">Bookmarks</p>
                  </Link>
                </div>
                <div className="flex items-center gap-2 hover-bg py-3 px-3">
                  <p>
                    <IoSettingsOutline className="text-[20px]" />
                  </p>
                  <p className="text-[16px] font-[600]">Settings</p>
                </div>
              </div>
            </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MoreContainerTrigger;
