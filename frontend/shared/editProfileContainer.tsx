"use client";
import { deleteTweetMutate } from "@/graphql/mutation/tweet";
import { Tweet } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BiX } from "react-icons/bi";
import { BsEmojiFrown } from "react-icons/bs";
import { FiUserX } from "react-icons/fi";
import { IoIosStats } from "react-icons/io";
import { MdDelete, MdEditDocument } from "react-icons/md";
import { PiSpeakerSimpleSlash } from "react-icons/pi";

const EditProfileContainer = ({
  setEditProfileDialog,
}: {
  setEditProfileDialog: any;
}) => {
  const postRef = useRef<HTMLDivElement>(null);
  const { user } = useCurrentUser();
  const [isUserPost, setIsUserPost] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const handlePostDialog = (event: MouseEvent) => {
      if (postRef.current && !postRef.current.contains(event.target as Node)) {
        setEditProfileDialog(false);
      }
    };
    document.addEventListener("mousedown", handlePostDialog);

    return () => {
      document.removeEventListener("mousedown", handlePostDialog);
    };
  }, [setEditProfileDialog]);
  return (
    <div
      ref={postRef}
      style={{
        boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
      }}
      className="absolute text-white py-8 left-0 dimBg top-0 z-[100] w-full h-full flex items-center justify-center "
    >
      <div className="w-[45%] h-full bg-black rounded-[20px] px-4 py-3">
        <div className="sticky top-0 z-[100000] ">
          <div className="flex justify-between items-center backdrop-blur-sm z-[1000] bg-pink-900  ">
            <div className="flex items-center gap-6">
              <div
                onClick={() => setEditProfileDialog(false)}
                className="cursor-pointer"
              >
                <BiX className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[18px] font-[600]">Edit profile</p>
              </div>
            </div>
            <div>
              <button className="py-1 font-[600] px-4 rounded-full bg-white text-black capitalize">
                save
              </button>
            </div>
          </div>
        </div>
        <div className="w-full overflow-auto h-[200px]">
          {" "}
          hello dfkalj
          <div className="w-full h-[500vh]">hello again</div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileContainer;
