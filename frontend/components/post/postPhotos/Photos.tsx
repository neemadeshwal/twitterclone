"use client"
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import { FaAnglesRight } from "react-icons/fa6";
import Comment from "../comment";
import { useCurrentUser } from "@/hooks/user";
import { LuRepeat2 } from "react-icons/lu";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import SharePost from "@/shared/sharePost";
import SavePost from "@/shared/savePost";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { repostTweet } from "@/graphql/mutation/repost";
import { toggleLikeTweet } from "@/graphql/mutation/like";
import DivisionBar from "@/shared/divisionbar";

const Photos = ({photoNum,tweet}:any) => {
  const [showPhoto,setShowPhoto]=useState("")
  const queryClient=useQueryClient()
  const [liked, setLiked] = useState(false);
  const [repost, setRepost] = useState(false);
  const {user}=useCurrentUser()

  const mutation = useMutation({
    mutationFn: toggleLikeTweet,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const repostMutation = useMutation({
    mutationFn: repostTweet,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  async function handleRepostTweet() {
    if (!tweet || !tweet.id) {
      return;
    }
    const body = {
      tweetId: tweet.id,
    };
    try {
      await repostMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleTweetLike() {
    setLiked((prevVal) => !prevVal);
    if (!tweet?.id) {
      return;
    }
    const body = {
      tweetId: tweet.id,
    };
    try {
      await mutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    if(photoNum&&tweet&&tweet.photoArray){
      setShowPhoto(tweet.photoArray[photoNum-1])
    }
  },[photoNum,tweet])
  if(!showPhoto){
    return
  }
  return <div className="w-[64%] flex justify-center items-start  relative ">

     {
      showPhoto&&<Image src={showPhoto} alt="" width={100} height={100} className="w-[80%] h-[93%] object-contain "/>
     }
     <div className="absolute top-5 left-5 text-[30px]">
      <BiX/>
     </div>
     <div className="absolute top-5 right-5 text-[20px]">
     <FaAnglesRight/>
     </div>
     <div className="absolute bottom-0 w-full">
     <div className="flex justify-between py-2  pt-4 pb-4 w-[60%] mx-auto">
            <Comment tweet={tweet} user={user!} />
            <div
              onClick={handleRepostTweet}
              className="flex gap-1 items-center white text-[13px] font-[400]"
            >
              {repost ? (
                <LuRepeat2 className="text-[20px] text-[#00ba7c] " />
              ) : (
                <LuRepeat2 className="text-[20px] white " />
              )}
              <p className={`${repost ? "text-[#00ba7c]" : "white"}`}>
                {tweet?.repostTweet.length}
              </p>
            </div>
            <div
              onClick={handleTweetLike}
              className="flex gap-1 items-center  text-[13px] cursor-pointer font-[400]"
            >
              {liked ? (
                <FaHeart className="text-[20px] heart-animation text-red-500" />
              ) : (
                <CiHeart className="text-[20px] white" />
              )}
              <p className={liked ? "text-red-500" : "white"}>
                {tweet?.LikedBy.length}
              </p>
            </div>
            <SharePost
              link={`http://localhost:5000/${tweet.author.userName}/status/${tweet.id}`}
            />
            <SavePost singleTweet={tweet} user={user} />
          </div>
     </div>
    


  </div>;
  
};

export default Photos;
