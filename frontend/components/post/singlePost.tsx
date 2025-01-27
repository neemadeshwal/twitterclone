"use client";
import React, { use, useEffect, useState } from "react";
import { BsChat } from "react-icons/bs";
import { CiBookmark, CiHeart } from "react-icons/ci";
import { FaDotCircle, FaHeart } from "react-icons/fa";
import {
  IoEllipseOutline,
  IoEllipsisHorizontal,
  IoShareOutline,
} from "react-icons/io5";
import { ImLoop } from "react-icons/im";
import { LuDot, LuRepeat2 } from "react-icons/lu";
import DivisionBar from "@/shared/divisionbar";
import Image from "next/image";
import { useAllTweet } from "@/hooks/tweet";
import { Tweet } from "@/graphql/types";
import { getRandomDarkHexColor } from "@/lib/randomColor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeTweet } from "@/graphql/mutation/like";
import { useCurrentUser, useGetUserById } from "@/hooks/user";
import Comment from "./comment";
import { useRouter } from "next/navigation";
import PostActivity from "@/shared/postActivity";
import { repostTweet } from "@/graphql/mutation/repost";
import { io } from "socket.io-client";
import { useSocket } from "@/context/socketContext";
import SharePost from "@/shared/sharePost";
import SavePost from "@/shared/savePost";
import HoverProfileDetail from "@/shared/HoverProfileDetail";
import { formatTimeAgo, getDateTime } from "@/lib/timeStamp";

const SinglePost = ({ tweet }: { tweet: Tweet }) => {
  const [liked, setLiked] = useState(false);
  const [hoverOnName, setHoverOnName] = useState(false);
  const [repost, setRepost] = useState(false);
  const [isPostControlDialogOpen, setPostControlDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useCurrentUser();
  const [isHoveredOnProfileImgId, setIsHoveredOnProfileImgId] = useState("");
  const socket = useSocket();
  useEffect(() => {
    queryClient.refetchQueries({ queryKey: ["all-tweet"] });
  }, []);

  const mutation = useMutation({
    mutationFn: toggleLikeTweet,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["all-tweet"] });
      if (socket && user) {
        console.log(socket.id, "socket..");
        console.log("send notification from frontend......");
        socket.emit(
          "sendLikeNotification",
          {
            senderId: user.id,
            receiverId: tweet.author.id,
            socketId: socket.id,
          },
          () => {
            console.log("tweet like notification send ");
          }
        );
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const repostMutation = useMutation({
    mutationFn: repostTweet,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["all-tweet"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  async function handleRepostTweet() {
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
    const body = {
      tweetId: tweet.id,
    };
    try {
      await mutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (tweet.LikedBy && user) {
      setLiked(tweet.LikedBy.some((like) => like.userId === user.id));
    }
    if (tweet.repostTweet && user) {
      setRepost(tweet.repostTweet.some((repost) => repost.userId === user.id));
    }
  }, [tweet, user]);

  const handlePostClick = (id: string) => {
    router.push(`/${tweet.author.userName}/status/${id}`);
  };
  const handlePostPhotoClick = (id: string, photoId: number) => {
    router.push(`/${tweet.author.userName}/status/${id}/photos/${photoId}`);
  };
  const [hoveredUserId, setHoveredUserId] = useState("");
  const { user: currentUser } = useCurrentUser();

  const [hoverUser, setHoverUser] = useState<any>(null);

  // useEffect(() => {
  //   if (socket) {
  //     console.log("Socket initialized, setting up event listener...");
  //     console.log(socket, "socket");
  //     socket.on("getLikeNotification", (data) => {
  //       console.log("last notificaiton check");
  //       console.log("Received newLikeNotification:", data);
  //     });
  //   } else {
  //     console.log("Socket not initialized");
  //   }

  //   // Cleanup on unmount
  //   return () => {
  //     if (socket) {
  //       socket.off("getLikeNotification");
  //       console.log("Event listener removed");
  //     }
  //   };
  // }, [socket, liked]);

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("notify", (data) => {
  //       console.log(data.msg);
  //     });
  //   }
  //   return () => {
  //     socket.off("notify");
  //   };
  // }, [socket, liked]);

  return (
    <div className="w-full cursor-pointer py-3 ">
      <div className="flex gap-4 w-full px-4 sm:px-2">
        <div
          onMouseEnter={() => {
            setIsHoveredOnProfileImgId(tweet.author.id);
            setHoveredUserId(tweet.author.id);
          }}
          onMouseLeave={() => {
            setIsHoveredOnProfileImgId("");
            setHoveredUserId("");
            setHoverUser(null);
          }}
        >
          {tweet.author?.profileImgUrl ? (
            <div>
              {isHoveredOnProfileImgId && (
                <div className="">
                  {
                    <HoverProfileDetail
                      hoverOnName={hoverOnName}
                      hoverId={isHoveredOnProfileImgId}
                    />
                  }
                </div>
              )}
              {tweet.author?.profileImgUrl.startsWith("#") ? (
                <div
                  style={{ backgroundColor: tweet.author?.profileImgUrl }}
                  className="rounded-full w-10 h-10 flex items-center justify-center capitalize"
                >
                  {tweet.author?.firstName.slice(0, 1)}
                </div>
              ) : (
                <Image
                  src={tweet?.author?.profileImgUrl}
                  alt="style one"
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10"
                />
              )}
            </div>
          ) : (
            <div className="rounded-full w-10 h-10 bg-blue-900 flex items-center justify-center capitalize">
              {tweet.author?.firstName.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="w-full pl-0 px-4">
          <div className="flex justify-between w-full ">
            <div
              onMouseEnter={() => {
                setIsHoveredOnProfileImgId(tweet.author.id);
                setHoveredUserId(tweet.author.id);
                setHoverOnName(true);
              }}
              onMouseLeave={() => {
                setIsHoveredOnProfileImgId("");
                setHoveredUserId("");
                setHoverUser(null);
                setHoverOnName(false);
              }}
              className="flex flex-col sm:flex-row items-start sm:gap-1 sm:items-center"
            >
              <div className="flex items-center">
                <p className="capitalize font-[600] md:text-[17px] text-[15px] leading-[20px]">
                  {tweet.author?.firstName}
                </p>
                <p className="hidden sm:inline-block gray font-[300]">@{tweet.author?.userName}</p>
              </div>
              <div className="flex items-center sm:items-start ">
                <p className="sm:hidden gray text-[15px] leading-[19px] font-[400]">@{tweet.author?.userName}</p>

              <p>
                <LuDot className="gray font-[300]" />
              </p>
              
              <p className="gray text-[14px] md:text-[16px] leading-[19px] font-[300]">
                {formatTimeAgo(getDateTime(tweet?.createdAt))}
              </p>
            </div>
            </div>

            <div
              className="relative"
              onClick={() => setPostControlDialogOpen(true)}
            >
              <IoEllipsisHorizontal className="gray" />
              {isPostControlDialogOpen && (
                <PostActivity
                  singleTweet={tweet}
                  setPostControlDialogOpen={setPostControlDialogOpen}
                />
              )}
            </div>
          </div>
          <div className="mt-1" onClick={() => handlePostClick(tweet.id)}>
            {tweet?.content}

            {tweet?.hashtags?.length !== 0 && (
              <div className="mt-2">
                {tweet?.hashtags?.map((item) => {
                  return (
                    <span key={item.id} className="x-textcolor ">
                      {item.text}{" "}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          {(tweet?.photoArray || tweet?.videoArray) &&
            (tweet?.photoArray?.length !== 0 ||
              tweet?.videoArray?.length !== 0) && (
              <div
                className={`my-2 grid w-full border border-gray-600 z-50 overflow-hidden rounded-[20px] gap-x-[2px] gap-y-[2px] grid-flow-row ${
                  tweet?.photoArray?.length + tweet?.videoArray?.length > 2
                    ? "grid-cols-2 h-[250px] sm:h-[400px] md:h-[500px]"
                    : tweet?.photoArray?.length + tweet?.videoArray?.length ===
                      2
                    ? "grid-cols-2 h-[180px] sm:h-[350px] gap-x-[2px] "
                    : "grid-cols-1 h-[180px]  sm:h-[500px]"
                }`}
              >
                {tweet?.photoArray?.length !== 0 &&
                  tweet?.photoArray?.map((url, index) => (
                    <div
                      onClick={() => handlePostPhotoClick(tweet.id, index + 1)}
                      key={url}
                      className="relative overflow-hidden"
                    >
                      <Image
                        src={url}
                        alt=""
                        width={400}
                        height={500}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}

                {tweet?.videoArray?.length !== 0 &&
                  tweet?.videoArray?.map((url) => (
                    <div key={url} className="relative overflow-hidden">
                      <video
                        controls
                        loop
                        autoPlay
                        className="w-full h-full object-cover"
                        muted
                      >
                        <source src={url} type="video/mp4" />
                      </video>
                    </div>
                  ))}
              </div>
            )}

          <div className="flex justify-between py-2 pt-3 pb-4">
            <div className="flex items-center justify-center">
              <Comment tweet={tweet} user={user!} />
            </div>
            <div
              onClick={handleRepostTweet}
              className="flex gap-1 items-center gray text-[13px] font-[400]"
            >
              {repost ? (
                <LuRepeat2 className="text-[20px] text-[#00ba7c] " />
              ) : (
                <LuRepeat2 className="text-[20px] " />
              )}
              <p className={`${repost ? "text-[#00ba7c]" : "gray"}`}>
                {tweet?.repostTweet.length}
              </p>
            </div>
            <div
              onClick={handleTweetLike}
              className="flex gap-1 items-center gray text-[13px] cursor-pointer font-[400]"
            >
              {liked ? (
                <FaHeart className="text-[20px] heart-animation text-red-500" />
              ) : (
                <CiHeart className="text-[20px] " />
              )}
              <p className={liked ? "text-red-500" : "gray"}>
                {tweet?.LikedBy.length}
              </p>
            </div>
            <SharePost
              link={`http://localhost:5000/${tweet.author.userName}/status/${tweet.id}`}
            />
            <SavePost singleTweet={tweet} user={user} />
          </div>
        </div>
      </div>
      <DivisionBar type="x" />
    </div>
  );
};

export default SinglePost;
