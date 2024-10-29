"use client";
import { useCurrentUser } from "@/hooks/user";
import { getRandomDarkHexColor } from "@/lib/randomColor";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const CurrentUser = () => {
  const { user } = useCurrentUser();
  console.log(user, "user");
  const [color, setColor] = useState("");

  useEffect(() => {
    setColor(getRandomDarkHexColor());
  }, []);

  return (
    <div className=" ">
      <div className="">
        {user?.profileImgUrl ? (
          <Image src={user?.profileImgUrl} alt="" width={40} height={40} />
        ) : (
          <div
            className="rounded-full p-3 px-4 flex items-center justify-center capitalize"
            style={{ backgroundColor: color }}
          >
            {user?.firstName.slice(0, 1)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentUser;
