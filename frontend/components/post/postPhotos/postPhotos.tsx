"use client"
import React from "react";
import Photos from "./Photos";
import PostDetail from "./PostDetail";
import { usePathname } from "next/navigation";
import { useGetSingleTweet } from "@/hooks/tweet";
import DivisionBar from "@/shared/divisionbar";


const PostPhotos = () => {
   const pathname=usePathname()
   const idArr=pathname.split("/")
   const id=idArr[idArr.length-3];
   const photoNum=idArr[idArr.length-1]

   const { singleTweet } = useGetSingleTweet(id);
  return (
    <div className="bg-black/80">
      <div>
        <div className="w-full flex min-h-screen gap-1 h-auto">
          <Photos photoNum={photoNum}  tweet={singleTweet}/>
          <div className="">
     <DivisionBar type="y"/>

     </div>
          <PostDetail tweet={singleTweet}/>
        </div>
      </div>
    </div>
  );
};

export default PostPhotos;
