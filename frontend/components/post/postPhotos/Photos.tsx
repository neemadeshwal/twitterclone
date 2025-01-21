"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiX } from "react-icons/bi";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import Comment from "../comment";
import { useCurrentUser } from "@/hooks/user";
import { LuRepeat2 } from "react-icons/lu";
import { CiHeart } from "react-icons/ci";
import { FaArrowLeft, FaArrowRight, FaHeart } from "react-icons/fa";
import SharePost from "@/shared/sharePost";
import SavePost from "@/shared/savePost";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { repostTweet } from "@/graphql/mutation/repost";
import { toggleLikeTweet } from "@/graphql/mutation/like";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Photos = ({
  photoNum,
  tweet,
  setShowFullPhoto,
  showFullPhoto,
  currentUrl,
}: any) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(
    Number(photoNum) - 1
  );
  const [showPhoto, setShowPhoto] = useState("");
  const [isSliding, setIsSliding] = useState(false);
  const [liked, setLiked] = useState(false);
  const [repost, setRepost] = useState(false);

  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  const mutation = useMutation({
    mutationFn: toggleLikeTweet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
    },
  });

  const repostMutation = useMutation({
    mutationFn: repostTweet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["single-tweet"] });
    },
  });

  useEffect(() => {
    if (tweet?.LikedBy && user) {
      setLiked(tweet.LikedBy.some((like: any) => like.userId === user.id));
    }
    if (tweet?.repostTweet && user) {
      setRepost(
        tweet.repostTweet.some((repost: any) => repost.userId === user.id)
      );
    }
  }, [tweet, user]);

  useEffect(() => {
    if (photoNum && tweet?.photoArray) {
      setCurrentPhotoIndex(Number(photoNum) - 1);
      setShowPhoto(tweet.photoArray[Number(photoNum) - 1]);
    }
  }, [photoNum, tweet]);

  const handleNavigation = (direction: "prev" | "next") => {
    if (isSliding) return; // Prevent multiple clicks during transition

    setIsSliding(true);
    const newIndex =
      direction === "prev"
        ? Math.max(0, currentPhotoIndex - 1)
        : Math.min(tweet.photoArray.length - 1, currentPhotoIndex + 1);

    setCurrentPhotoIndex(newIndex);
    setShowPhoto(tweet.photoArray[newIndex]);
  };

  const handleTransitionEnd = () => {
    setIsSliding(false);
    const newUrl = `${currentUrl}${currentPhotoIndex + 1}`;
    window.history.replaceState({ ...window.history.state }, "", newUrl);
  };

  const handleTweetLike = async () => {
    if (!tweet?.id) return;
    setLiked((prev) => !prev);
    try {
      await mutation.mutateAsync({ tweetId: tweet.id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRepostTweet = async () => {
    if (!tweet?.id) return;
    try {
      await repostMutation.mutateAsync({ tweetId: tweet.id });
    } catch (error) {
      console.log(error);
    }
  };

  if (!showPhoto) return null;

  return (
    <div
      className={`${
        showFullPhoto ? "w-[100%]" : "w-[64%]"
      } overflow-hidden flex justify-center items-start relative`}
    >
      <div className="flex w-screen  h-screen bg-black">
        <Carousel>
          <CarouselContent>
            {tweet?.photoArray.map((image: string) => (
              <CarouselItem key={image}>
                <div className=" ">
                  <Image
                    style={{
                      transform: `translateX(-${currentPhotoIndex * 100}%)`,
                    }}
                    onTransitionEnd={handleTransitionEnd}
                    src={image}
                    alt=""
                    width={1000}
                    height={1000}
                    className={`  ${
                      isSliding ? "transform" : ""
                    } transition-transform duration-500 ease-in-out ${
                      showFullPhoto
                        ? "h-[90vh] w-screen object-contain"
                        : "h-[90vh]  object-contain"
                    } `}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="absolute top-5 left-5 text-[30px]">
        <Link href="/">
          <BiX />
        </Link>
      </div>

      <div
        onClick={() => setShowFullPhoto((prev: boolean) => !prev)}
        className="absolute top-5 right-5 text-[20px]"
      >
        {showFullPhoto ? <FaAnglesLeft /> : <FaAnglesRight />}
      </div>

      <div className="">
        {currentPhotoIndex > 0 && (
          <div
            onClick={() => handleNavigation("prev")}
            className="absolute bg-black/50 rounded-full cursor-pointer p-2 left-10 top-[50%]"
          >
            <FaArrowLeft />
          </div>
        )}
        {currentPhotoIndex < tweet.photoArray.length - 1 && (
          <div
            onClick={() => handleNavigation("next")}
            className="absolute right-10 bg-black/50 rounded-full cursor-pointer p-2 top-[50%]"
          >
            <FaArrowRight />
          </div>
        )}
      </div>

      {/* Rest of your component (Bottom bar) remains the same */}
      <div className="fixed w-[60%] bottom-0">
        <div className="flex justify-between py-2 pt-4 pb-4 w-[60%] mx-auto">
          <div className="flex items-center">
            <Comment iconColor="white" tweet={tweet} user={user!} />
          </div>
          <div
            onClick={handleRepostTweet}
            className="flex gap-1 items-center white text-[13px] font-[400]"
          >
            {repost ? (
              <LuRepeat2 className="text-[20px] text-[#00ba7c]" />
            ) : (
              <LuRepeat2 className="text-[20px] white" />
            )}
            <p className={`${repost ? "text-[#00ba7c]" : "white"}`}>
              {tweet?.repostTweet.length}
            </p>
          </div>
          <div
            onClick={handleTweetLike}
            className="flex gap-1 items-center text-[13px] cursor-pointer font-[400]"
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
            iconColor="white"
            link={`http://localhost:5000/${tweet.author.userName}/status/${tweet.id}`}
          />
          <SavePost iconColor="white" singleTweet={tweet} user={user} />
        </div>
      </div>
    </div>
  );
};

export default Photos;
