import { getCurrentUser } from "@/graphql/types";
import Image from "next/image";
import React from "react";

const SingleFollowUser = ({ user }: { user: getCurrentUser }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between w-full">
        <div className="flex gap-2 items-center">
          <div>
            {user.profileImgUrl ? (
              <Image
                src={user?.profileImgUrl}
                alt=""
                width={100}
                height={100}
              />
            ) : (
              <div className=" flex items-center justify-center capitalize  cursor-pointer">
                <p className="bg-green-900 rounded-full w-10 h-10 flex items-center justify-center ">
                  {user?.firstName.slice(0, 1)}
                </p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-[16px] font-[500] capitalize hover:underline underline-white cursor-pointer">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="gray text-[14px] font-[300] break-all">
              {user?.userName}
            </p>
          </div>
        </div>
        <div>
          <button className="px-4 py-1 rounded-full bg-white text-black capitalize font-[600]">
            follow
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleFollowUser;
