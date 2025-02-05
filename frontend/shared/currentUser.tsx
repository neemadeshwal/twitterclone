"use client";
import { useCurrentUser } from "@/hooks/user";
import { getRandomDarkHexColor } from "@/lib/randomColor";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const CurrentUser = ({
  user,
  customSize,
}: {
  user: any;
  customSize?: boolean;
}) => {
  return (
    <div className=" ">
      <div className="">
        {user?.profileImgUrl ? (
          <div>
            {user?.profileImgUrl.startsWith("#") ? (
              <div
                className={`rounded-full ${
                  customSize ? "w-8 h-8" : "w-10 h-10"
                }  flex items-center justify-center capitalize`}
                style={{ backgroundColor: user?.profileImgUrl }}
              >
                {user?.firstName.slice(0, 1)}
              </div>
            ) : (
              <Image
                className="rounded-full w-10 h-10"
                src={user?.profileImgUrl}
                alt=""
                width={40}
                height={40}
              />
            )}
          </div>
        ) : (
          <div className="rounded-full w-10 h-10 bg-purple-950 flex items-center justify-center capitalize">
            {user?.firstName.slice(0, 1)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentUser;
