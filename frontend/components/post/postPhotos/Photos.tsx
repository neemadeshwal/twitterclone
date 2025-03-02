import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { BiX } from "react-icons/bi";
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Comment, Tweet } from "@/graphql/types";
import { useRouter } from "next/navigation";

const Photos = ({
  tweet,
  photoNum,
  setShowFullPhoto,
  currentUrl,
  showFullPhoto,
}: {
  tweet: Tweet | Comment;
  photoNum: string;
  showFullPhoto: boolean;
  currentUrl: string;
  setShowFullPhoto: Dispatch<SetStateAction<boolean>>;
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(
    Number(photoNum) - 1
  );
  const [isSliding, setIsSliding] = useState(false);
  const [showPhoto, setShowPhoto] = useState("");

  useEffect(() => {
    if (photoNum && tweet?.mediaArray) {
      setCurrentPhotoIndex(Number(photoNum) - 1);
      setShowPhoto(tweet.mediaArray[Number(photoNum) - 1]);
    }
  }, [photoNum, tweet]);

  const handleNavigation = (direction: "prev" | "next") => {
    if (isSliding) return; // Prevent multiple clicks during transition

    setIsSliding(true);
    const newIndex =
      direction === "prev"
        ? Math.max(0, currentPhotoIndex - 1)
        : Math.min(tweet.mediaArray.length - 1, currentPhotoIndex + 1);

    setCurrentPhotoIndex(newIndex);
    setShowPhoto(tweet.mediaArray[newIndex]);
  };

  const handleTransitionEnd = () => {
    setIsSliding(false);
    const newUrl = `${currentUrl}${currentPhotoIndex + 1}`;
    window.history.replaceState({ ...window.history.state }, "", newUrl);
  };

  const router = useRouter();

  if (!showPhoto) return null;

  return (
    <div>
      <div className="flex w-screen  h-screen bg-black">
        <Carousel>
          <CarouselContent>
            {tweet?.mediaArray.map((image: string) => (
              <CarouselItem key={image}>
                <div className={`${!showFullPhoto && "flex justify-center"}`}>
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
                        : "h-[90vh] p-14 w-screen object-contain"
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

      <div
        onClick={() => router.back()}
        className="absolute top-5 left-5 text-[30px]"
      >
        <BiX />
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
        {currentPhotoIndex < tweet.mediaArray.length - 1 && (
          <div
            onClick={() => handleNavigation("next")}
            className="absolute right-10 bg-black/50 rounded-full cursor-pointer p-2 top-[50%]"
          >
            <FaArrowRight />
          </div>
        )}
      </div>
    </div>
  );
};

export default Photos;
