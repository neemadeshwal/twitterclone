"use client";
import { deleteTweetMutate } from "@/graphql/mutation/tweet";
import { Comment, Tweet } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiFrown } from "react-icons/bs";
import { FiUser, FiUserX } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";
import { MdDelete, MdEditDocument } from "react-icons/md";
import { PiSpeakerSimpleSlash } from "react-icons/pi";
import PostContainer from "./postContainer";
import DeletePostContainer from "./DeletePostContainer";
import PortalContainerWrapper from "./PortalContainerWrapper";

const PostActivity = ({
  setPostControlDialogOpen,
  isDrawer,
  singleTweet,
  isComment,
  setDeleteDialog,
  deleteDialog,
  setIsContainerOpen,
  setEditPost,
}: {
  setPostControlDialogOpen: any;
  singleTweet: Tweet | Comment;
  isDrawer?: boolean;
  setIsTriggerDrawerOpen?: any;
  isComment?: boolean;
  deleteDialog:boolean;
  editPost:boolean;
  setIsContainerOpen:React.Dispatch<React.SetStateAction<boolean>>
  setEditPost:React.Dispatch<React.SetStateAction<boolean>>

  setDeleteDialog:React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { user } = useCurrentUser();
  const [isUserPost, setIsUserPost] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
    const [isAlreadyFollowing, setIsAlreadyFollowing] = useState(false);
  
     useEffect(() => {
        if (!singleTweet.author || !user) {
          return;
        }
    
        const isFollowing = singleTweet.author?.followers?.find(
          (item) => item.followerId === user.id
        );
        if (isFollowing) {
          setIsAlreadyFollowing(true);
        } else {
          setIsAlreadyFollowing(false);
        }
      }, [singleTweet.author, user]);

  useEffect(() => {
    if (!user || !singleTweet) {
      return;
    }

    if (user.id === singleTweet.author.id) {
      setIsUserPost(true);
    } else {
      setIsUserPost(false);
    }
  }, [singleTweet.id, user]);



  return (
    <>
      <div
        style={{
          boxShadow: !isDrawer ? "0 0 6px rgba(255, 255, 255, 0.6)" : "",
        }}
        className={`${
          !isDrawer ? "absolute w-[350px]" : "w-full"
        } text-white p-4 py-8 right-0 top-0 z-[1000] h-auto  bg-black rounded-[15px]`}
      >
        <div className="flex flex-col gap-6">
          {isUserPost ? (
            <div className="flex flex-col gap-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                   setPostControlDialogOpen(false);
                    setDeleteDialog(true);
                }}
                className="flex gap-3 items-center font-[600] text-red-500"
              >
                <MdDelete className="font-[600] text-[20px]" />
                Delete
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsContainerOpen(false)
                  setEditPost(true);
                  
                  setIsContainerOpen(true);
                }}
                className="flex gap-3 items-center font-[600]"
              >
                <MdEditDocument className="font-[600] text-[17px]" />
                Edit
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <button className="flex gap-3 items-center font-[600]">
                <BsEmojiFrown className="font-[600] text-[17px]" />
                Not interested in this post
              </button>
              <button className="flex gap-3 items-center font-[600]">
                {
                  isAlreadyFollowing?
                <FiUserX className="font-[600] text-[17px]" />:
                <FiUser className="font-[600] text-[17px]" />


                }
               {isAlreadyFollowing?"Unfollow":"Follow"}@{singleTweet?.author.userName}
              </button>
              <button className="flex gap-3 items-center font-[600]">
                <PiSpeakerSimpleSlash className="font-[600] text-[17px]" />
                Mute @{singleTweet?.author.userName}
              </button>
            </div>
          )}
          <button
            onClick={() =>
              router.push(
                `/${singleTweet?.author.userName}/status/${singleTweet?.id}`
              )
            }
            className="flex gap-3 items-center font-[600]"
          >
            <IoIosStats className="font-[600] text-[17px]" />
            View post engagements
          </button>
        </div>
      
       
      </div>
    </>
  );
};

export default PostActivity;
