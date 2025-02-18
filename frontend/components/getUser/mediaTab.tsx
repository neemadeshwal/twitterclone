import { Tweet } from "@/graphql/types";
import Image from "next/image";
import React from "react";

const MediaTab = ({ mediaPost }: { mediaPost: Tweet[] }) => {
  const mediaListArr = mediaPost.reduce<string[][]>((acc, item) => {
    if (item.mediaArray.length !== 0) {
      const singleItem = [...item.mediaArray];
      acc.push(singleItem);
    }
    return acc;
  }, []);

  console.log(mediaListArr, "listar");

  return (
    <div>
      <div className="w-full h-[140px] grid grid-cols-3 grid-flow-row gap-1">
        {mediaListArr.length !== 0 &&
          mediaListArr.map((item) => {
            if (item[0].endsWith(".mp4")) {
              return (
                <video className="h-full w-full" key={item[0]}>
                  <source src={item[0]} type="video/mp4" />
                </video>
              );
            } else {
              return (
                <Image
                  key={item[0]}
                  src={item[0]}
                  alt=""
                  width={100}
                  height={100}
                  className="w-full h-full"
                />
              );
            }
          })}
      </div>
    </div>
  );
};

export default MediaTab;
