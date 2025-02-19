import { authorType } from "@/graphql/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PostContent = ({
  content,
  hashtags,
  mediaArray,
  author,
  tweetId,
  isComment,
  showMedia,
}: {
  content: string;
  hashtags: any;
  mediaArray: string[];
  author: authorType;
  tweetId: string;
  isComment?: boolean;
  showMedia?: boolean;
}) => {
  console.log(showMedia, "showmedia");
  return (
    <div>
      <div className="mt-1">
        <Link
          href={`/${author?.userName}/${
            isComment ? "comment" : "status"
          }/${tweetId}`}
        >
          {content}
        </Link>

        {hashtags && hashtags?.length !== 0 && (
          <div className="mt-2">
            {hashtags?.map((item: any) => (
              <span key={item.id} className="x-textcolor">
                {item.text}{" "}
              </span>
            ))}
          </div>
        )}
      </div>
      {showMedia && mediaArray && mediaArray.length !== 0 && (
        <div
          className={`my-2 grid w-full border border-gray-600 z-50 overflow-hidden rounded-[20px] gap-x-[2px] gap-y-[2px] grid-flow-row ${
            mediaArray.length > 2
              ? "grid-cols-2 h-[250px] xs:h-[300px] sm:h-[400px] md:h-[500px]"
              : mediaArray.length === 2
              ? "grid-cols-2 h-[180px] xs:h-[250px]  sm:h-[350px] gap-x-[2px]"
              : "grid-cols-1 h-[180px] sm:h-[500px] xs:h-[300px] "
          }`}
        >
          {mediaArray?.map((url, index) => (
            <Link
              className={`w-full h-full ${
                mediaArray.length == 3 && index == 1 && "row-span-2"
              } `}
              key={url}
              href={`/${author.userName}/${
                isComment ? "comment" : "status"
              }/${tweetId}/photos/${index + 1}`}
            >
              <div className={`relative overflow-hidden w-full h-full `}>
                {url.endsWith(".mp4") ? (
                  <video
                    controls
                    loop
                    autoPlay
                    className="w-full h-full object-cover"
                    muted
                  >
                    <source src={url} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={url}
                    alt="Tweet media"
                    width={400}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostContent;
