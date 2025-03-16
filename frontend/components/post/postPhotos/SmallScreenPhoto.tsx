import { Tweet, Comment, Like, Repost } from "@/graphql/types";
import AuthorProfile from "@/shared/AuthorProfile";
import { Icons } from "@/utils/icons";
import React, { useEffect, useState, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import PostInteractions from "@/shared/PostDetail/PostInteractions";
import { useCurrentUser } from "@/hooks/user";
import { useTweetMutation } from "@/hooks/mutation/useTweetMutation";
import ComposePost from "../compostPost";
import { useRouter } from "next/navigation";

const isTweet = (tweet: Tweet | Comment): tweet is Tweet =>
  tweet !== undefined && tweet !== null && "repostTweet" in tweet;

const isCommentCheck = (tweet: Tweet | Comment): tweet is Comment =>
  tweet !== undefined && tweet !== null && "repostComment" in tweet;
const SmallScreenPhoto = ({
  tweet,
  isComment,
  photoNum,
  currentUrl,
}: {
  tweet: Tweet | Comment;
  isComment: boolean;
  photoNum: string;
  currentUrl: string;
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(
    Number(photoNum) - 1
  );
  const composerRef = useRef<HTMLDivElement | null>(null);
  const [previousIndex, setPreviousIndex] = useState(Number(photoNum) - 1);
  const [showPhoto, setShowPhoto] = useState("");
  const [isSliding, setIsSliding] = useState(false);
  const [liked, setLiked] = useState(false);
  const [repost, setRepost] = useState(false);
  const carouselApiRef = useRef<CarouselApi | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const { user } = useCurrentUser();

  const { likeTweet, repostTweet } = useTweetMutation({});

  // Set up the carousel API reference
  const setCarouselApi = React.useCallback(
    (api: CarouselApi) => {
      carouselApiRef.current = api;

      // Initial setup when API is available
      if (api && tweet?.mediaArray) {
        const selectedIndex = api.selectedScrollSnap();
        if (selectedIndex !== currentPhotoIndex) {
          setCurrentPhotoIndex(selectedIndex);
          setShowPhoto(tweet.mediaArray[selectedIndex]);
        }
      }
    },
    [currentPhotoIndex, tweet]
  );

  // Handle carousel selection changes
  const handleCarouselSelect = React.useCallback(() => {
    const api = carouselApiRef.current;
    if (!api || !tweet?.mediaArray) return;

    const selectedIndex = api.selectedScrollSnap();
    const direction = selectedIndex > previousIndex ? "forward" : "backward";

    console.log(
      `Slide direction: ${direction}, New index: ${selectedIndex}, Previous index: ${previousIndex}`
    );

    // Update our state
    setPreviousIndex(currentPhotoIndex);
    setCurrentPhotoIndex(selectedIndex);
    setShowPhoto(tweet.mediaArray[selectedIndex]);

    // Update URL and release sliding lock
    const newUrl = `${currentUrl}${selectedIndex + 1}`;
    window.history.replaceState({ ...window.history.state }, "", newUrl);
    setIsSliding(false);
  }, [currentPhotoIndex, previousIndex, tweet, currentUrl]);

  // Repost handling function
  async function handleRepostTweet() {
    if (!tweet || !tweet.id) {
      return;
    }
    const body = {
      tweetId: tweet.id,
    };
    try {
      await repostTweet(body);
    } catch (error) {
      console.log(error);
    }
  }

  // Like handling function
  async function handleTweetLike() {
    setLiked((prevVal) => !prevVal);
    if (!tweet?.id) {
      return;
    }
    const body = {
      tweetId: tweet.id,
    };
    try {
      await likeTweet(body);
    } catch (error) {
      console.log(error);
    }
  }

  const router = useRouter();
  useEffect(() => {
    if (isTweet(tweet)) {
      // Logic specific to Tweet
      if (tweet?.likedBy && user) {
        setLiked(tweet.likedBy.some((like: Like) => like.userId === user.id));
      }
      if (tweet?.repostTweet && user) {
        setRepost(
          tweet.repostTweet.some((repost: Repost) => repost.userId === user.id)
        );
      }
    } else if (isCommentCheck(tweet)) {
      // Logic specific to Comment
      if (tweet?.likes && user) {
        setLiked(tweet.likes.some((like: Like) => like.userId === user.id));
      }
      if (tweet?.repostComment && user) {
        setRepost(
          tweet.repostComment.some(
            (repost: Repost) => repost.userId === user.id
          )
        );
      }
    }
  }, [tweet, user]);

  useEffect(() => {
    if (photoNum && tweet?.mediaArray) {
      setCurrentPhotoIndex(Number(photoNum) - 1);
      setPreviousIndex(Number(photoNum) - 1);
      setShowPhoto(tweet.mediaArray[Number(photoNum) - 1]);
    }
  }, [photoNum, tweet]);

  // Listen for carousel API select events
  useEffect(() => {
    const api = carouselApiRef.current;
    if (!api) return;

    // Set up event listeners
    api.on("select", handleCarouselSelect);

    // Clean up
    return () => {
      api.off("select", handleCarouselSelect);
    };
  }, [handleCarouselSelect]);

  const handleNavigation = (direction: "prev" | "next") => {
    if (isSliding || !tweet?.mediaArray || !carouselApiRef.current) return;

    setIsSliding(true);

    // Use the carousel API to scroll programmatically
    if (direction === "prev") {
      carouselApiRef.current.scrollPrev();
    } else {
      carouselApiRef.current.scrollNext();
    }
  };

  const handleTransitionEnd = () => {
    setIsSliding(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        composerRef.current &&
        !composerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!showPhoto) return null;

  return (
    <div className="py-4 relative w-full h-screen">
      <div className="sticky top-0 z-[10000] backdrop-blur-md">
        <div className="flex justify-between px-4">
          <Icons.ArrowLeft className="" onClick={() => router.back()} />
          <Icons.VerticalDots />
        </div>
        <div className="py-8 px-2 flex justify-between">
          <div className="flex gap-4 items-center">
            <AuthorProfile author={tweet?.author} />
            <div>
              <h2 className="capitalize">
                {tweet?.author.firstName} {tweet?.author.lastName}
              </h2>
              <p>@{tweet?.author.userName}</p>
            </div>
          </div>
          <div>
            <button className="rounded-full px-6 py-1 capitalize border">
              follow
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <Carousel
            opts={{
              loop: false,
              startIndex: currentPhotoIndex,
            }}
            setApi={setCarouselApi}
          >
            <CarouselContent className="px-0 mx-0 pl-0 ml-0 w-full">
              {tweet?.mediaArray.map((image: string) => (
                <CarouselItem className="pl-0" key={image}>
                  <div className="flex justify-center">
                    <Image
                      onTransitionEnd={handleTransitionEnd}
                      src={image}
                      alt=""
                      width={1000}
                      height={1000}
                      className="transition-transform duration-500 ease-in-out h-[58vh] pl-0 px-0 w-screen object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute hidden left-2 top-1/2 -translate-y-1/2 z-10">
              <CarouselPrevious
                onClick={() => handleNavigation("prev")}
                className={`${
                  currentPhotoIndex === 0 ? "opacity-30 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div className="absolute hidden right-2 top-1/2 -translate-y-1/2 z-10">
              <CarouselNext
                onClick={() => handleNavigation("next")}
                className={`${
                  currentPhotoIndex === (tweet?.mediaArray?.length || 0) - 1
                    ? "opacity-30 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>
          </Carousel>
        </div>
        {!isFocused && (
          <PostInteractions
            isInPhotoSection={true}
            tweet={tweet}
            liked={liked}
            repost={repost}
            handleRepostTweet={handleRepostTweet}
            handleTweetLike={handleTweetLike}
          />
        )}
        <div className="w-full bottom-0 px-4">
          <div
            className=""
            ref={composerRef}
            onClick={() => setIsFocused(true)}
          >
            <ComposePost
              user={user!}
              isInPhotoSection={true}
              tweetId={tweet.id}
              isParentComment={isComment}
              isComment={true}
              isPhotoInputFocused={isFocused}
              userNameInPhoto={tweet?.author.userName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallScreenPhoto;
