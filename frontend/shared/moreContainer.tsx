import React, { useRef } from "react";
import useOutsideClick from "./closeContainer";
import { PiBookmarkSimple } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import Link from "next/link";

const MoreContainer = ({ setMoreContainer }: any) => {
  const moreContainerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(moreContainerRef, () => setMoreContainer(false));

  return (
      <div
        ref={moreContainerRef}
        className="absolute   z-[100000] left-0 bg-black"
      >
        <div
          style={{
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
          }}
          className="rounded-[15px] w-[300px] z-[100000] min-h-[150px] h-auto py-3 bg-black"
        >
          <div className="flex flex-col z-50 bg-black ">
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
      </div>
  );
};

export default MoreContainer;
