"use client"
import React, { useEffect, useState } from "react";
import Photos from "./Photos";
import PostDetail from "./PostDetail";
import { usePathname } from "next/navigation";
import { useGetSingleTweet } from "@/hooks/tweet";
import DivisionBar from "@/shared/divisionbar";
import { useGlobalContext } from "@/context/globalContext";


const PostPhotos = () => {
   const pathname=usePathname()

   const{showFullPhoto,setShowFullPhoto}=useGlobalContext()

   const idArr=pathname.split("/")

   const currentUrl=pathname.slice(0,pathname.length-1)
   const id=idArr[idArr.length-3];
   const photoNum=idArr[idArr.length-1]


   const { singleTweet } = useGetSingleTweet(id);


  

  return (
    <div className="bg-black/80 h-screen">
      <div>
        <div className="w-full flex min-h-screen gap-1 h-auto">
          <Photos currentUrl={currentUrl} photoNum={photoNum} showFullPhoto={showFullPhoto} setShowFullPhoto={setShowFullPhoto}  tweet={singleTweet}/>
          <div className="">
     <DivisionBar type="y"/>

     </div>
     {
      !showFullPhoto&&
      <PostDetail tweet={singleTweet}/>


     }
        </div>
      </div>
    </div>
  );
};

export default PostPhotos;
