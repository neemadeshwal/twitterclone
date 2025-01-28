"use client";
import { deleteTweetMutate } from "@/graphql/mutation/tweet";
import { Tweet } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiFrown } from "react-icons/bs";
import { FiUserX } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";
import { MdDelete, MdEditDocument } from "react-icons/md";
import { PiSpeakerSimpleSlash } from "react-icons/pi";
import PostContainer from "./postContainer";

const PostActivity = ({
  setPostControlDialogOpen,
  isDrawer,
  singleTweet,
}: {
  setPostControlDialogOpen: any;
  singleTweet: Tweet;
  isDrawer?: boolean;
}) => {
  const postRef = useRef<HTMLDivElement>(null);
  const { user } = useCurrentUser();
  console.log(singleTweet, "single tweet twer");
  const [isUserPost, setIsUserPost] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [editPost, setEditPost] = useState(false);
  const[deleteDialog,setDeleteDialog]=useState(false);
  const mutation = useMutation({
    mutationFn: deleteTweetMutate,
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({
        queryKey: ["single-tweet", "all-tweet", singleTweet.id],
      });
      router.replace("/");
      queryClient.refetchQueries({ queryKey: ["all-tweet"] });
    },
  });
  const handleDeletePost = async (id: string) => {
    if (!id) {
      return;
    }
    const body = {
      tweetId: id,
    };
    try {
      await mutation.mutateAsync(body);
      setPostControlDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user || !singleTweet) {
      return;
    }
    console.log(user.id);
    console.log(singleTweet.author.id);

    if (user.id === singleTweet.author.id) {
      setIsUserPost(true);
    } else {
      setIsUserPost(false);
    }
  }, [singleTweet.id, user]);
  useEffect(() => {
    const handlePostDialog = (event: MouseEvent) => {
      if (postRef.current && !postRef.current.contains(event.target as Node)) {
        setPostControlDialogOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePostDialog);

    return () => {
      document.removeEventListener("mousedown", handlePostDialog);
    };
  }, [setPostControlDialogOpen]);
  return (
    <div
      ref={postRef}
      style={{
        boxShadow: !isDrawer ? "0 0 6px rgba(255, 255, 255, 0.6)" : "",
      }}
      className={` ${
        !isDrawer ? "absolute w-[350px]" : "w-full"
      } text-white p-4 py-8 right-0 top-0 z-[100]  h-auto bg-black rounded-[15px]`}
    >
      <div className="flex flex-col gap-6">
        {isUserPost ? (
          <div className=" flex flex-col gap-6">
            <button
              onClick={() => setDeleteDialog(true)}
              className="flex gap-3 items-center font-[600] text-red-500"
            >
              <MdDelete className="font-[600] text-[20px]" />
              Delete
            </button>
            <PostContainer isEdit={true} editTweet={singleTweet} />
          </div>
        ) : (
          <div className=" flex flex-col gap-6">
            <button className="flex gap-3 items-center font-[600]">
              <BsEmojiFrown className="font-[600] text-[17px]" />
              Not interested in this post
            </button>
            <button className="flex gap-3 items-center font-[600]">
              {" "}
              <FiUserX className="font-[600] text-[17px]" />
              Unfollow @{singleTweet?.author.userName}
            </button>
            <button className="flex gap-3 items-center font-[600]">
              <PiSpeakerSimpleSlash className="font-[600] text-[17px]" />
              Mute @{singleTweet?.author.userName}
            </button>
          </div>
        )}
        <button className="flex gap-3 items-center font-[600]">
          <IoIosStats className="font-[600] text-[17px]" />
          View post engagements
        </button>
      </div>
      {editPost && <PostContainer isEdit={true} editTweet={singleTweet} />}
      {
        deleteDialog&&
        <div className="z-[1000000] flex justify-center items-center w-screen h-screen fixed gray top-0 left-0">

      <div className="h-auto z-[1000] w-auto rounded-[15px] bg-black">
        
        <h2>delete post?</h2>
        <p>This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results. </p>
        
        <button onClick={()=>handleDeletePost("34")}>delete</button>
        <button onClick={()=>setDeleteDialog(false)}>cancel</button>
                
      </div>
        </div>
      }
    </div>
  );
};

export default PostActivity;
