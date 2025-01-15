import React, { useRef } from "react";
import useOutsideClick from "./closeContainer";
import { PiBookmarkSimple } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import Link from "next/link";

const LogOutContainer = ({ setLogoutContainer ,userName}: any) => {
  const logOutContainerRef = useRef<HTMLDivElement>(null);
  useOutsideClick(logOutContainerRef, () => setLogoutContainer(false));

  return (
    <div className="absolute top-[-12rem] left-[-5rem]  z-[1000000]  bg-black">
      <div
        ref={logOutContainerRef}
        className="absolute z-50  bg-black"
      >
        <div
          style={{
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
          }}
          className="rounded-[15px] w-[280px] z-50 min-h-[100px] h-auto py-3 bg-black"
        >
          <div className="flex flex-col z-50 bg-black ">
            <div className="flex items-center gap-2 hover-bg py-3 px-3">
              <Link href="/logout" className="flex gap-2 items-center">
               
                <p className="text-[16px] font-[600]">Log out @{userName}</p>
              </Link>
            </div>
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogOutContainer;
