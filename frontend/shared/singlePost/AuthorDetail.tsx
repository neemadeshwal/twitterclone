import { authorType } from "@/graphql/types";
import { formatTimeAgo, getDateTime } from "@/lib/timeStamp";
import React from "react";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { LuDot } from "react-icons/lu";
import HoverWrapper from "./HoverWrapper";

const AuthorDetail = ({
  author,
  createdAt,
}: {
  author: authorType;
  createdAt: string;
}) => {
  return (
    <div>
      <div className="flex justify-between w-full">
        <div className="flex flex-col xs:flex-row items- sm:gap-1 sm:items-center">
          <div className="hidden xs:inline-block">
            <HoverWrapper userId={author?.userName}>
              <div className=" gap-1 items-center flex">
                <p className="capitalize font-[600] md:text-[17px] hover:underline text-[15px] leading-[20px]">
                  {author?.firstName} {author?.lastName}
                </p>
                <p className="hidden xs:inline-block gray font-[300]">
                  @{author?.userName}
                </p>
              </div>
            </HoverWrapper>
          </div>

          <div className="flex items-start sm:items-start gap-px flex-col">
            <p className="capitalize font-[600] xs:hidden  md:text-[17px] text-[15px] leading-[20px]">
              {author?.firstName} {author?.lastName}
            </p>
            <div className="flex">
            <p className="xs:hidden gray text-[15px] block leading-[19px] font-[400]">
              @{author?.userName}
            </p>
            <p >
              <LuDot className="gray font-[300] mt-1" />
            </p>

            <p className="gray text-[14px] md:text-[16px] xs:mt-1 leading-[19px] font-[300]">
              {formatTimeAgo(getDateTime(createdAt))}
            </p>
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default AuthorDetail;
