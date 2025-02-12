import { authorType } from "@/graphql/types";
import Image from "next/image";
import React from "react";

const AuthorProfile = ({ author,isSmall }: { author: authorType,isSmall?:boolean }) => {
  return (
    <div>
      {author?.profileImgUrl ? 
        <div>
          {author?.profileImgUrl.startsWith("#") ? (
            <div
              className={`rounded-full ${isSmall?"w-6 text-[14px] h-6":"w-10 h-10"} flex items-center justify-center capitalize`}
              style={{
                backgroundColor: author?.profileImgUrl,
              }}
            >
              {author?.firstName.slice(0, 1)}
            </div>
          ) : (
            <Image
              src={author?.profileImgUrl}
              alt=""
              width={40}
              height={40}
              className={` ${isSmall?"w-6 h-6":"w-10 h-10"} rounded-full `}
            />
          )}
        </div>
      : (
        <div className={`rounded-full  ${isSmall?"w-6 h-6":"w-10 h-10"} bg-blue-900 flex items-center justify-center capitalize`}>
          {author?.firstName.slice(0, 1)}
        </div>
      )}
    </div>
  );
};

export default AuthorProfile;
