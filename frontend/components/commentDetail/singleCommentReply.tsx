"use client";
import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { IoEllipsisHorizontal, IoShareOutline } from "react-icons/io5";
import { LuDot, LuRepeat2 } from "react-icons/lu";
import DivisionBar from "@/shared/divisionbar";
import Image from "next/image";
import { Comment as CommentType, Tweet } from "@/graphql/types";
import { getRandomDarkHexColor } from "@/lib/randomColor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeComment } from "@/graphql/mutation/like";
import { useRouter } from "next/navigation";
import ReplyComment from "@/components/postDetail/replyOnComment";
import Link from "next/link";
import SaveComment from "@/shared/saveComment";

const SingleCommentReply = ({
  comment,
  user,
}: {
  comment: CommentType;
  user: any;
}) => {
  const [liked, setLiked] = useState(false);
  console.log(comment, "comment in comment");
  const queryClient = useQueryClient();
  const [color, setColor] = useState("");
  const router = useRouter();
  useEffect(() => {
    setColor(getRandomDarkHexColor());
  }, []);

  const mutation = useMutation({
    mutationFn: toggleLikeComment,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["single-comment"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  async function handleTweetLike(commentId: string) {
    setLiked((prevVal) => !prevVal);
    const body = {
      commentId,
    };
    try {
      await mutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (comment.likes.length !== 0 && user) {
      setLiked(comment.likes.some((like) => like.userId === user.id));
    }
  }, [comment, user]);

  // const handlePostClick = (id: string) => {
  //   router.push(`/${tweet.author.userName}/status/${id}`);
  // };
  console.log(comment, "user user");
  return (
    <div
      // onClick={() => handlePostClick(comment.id)}
      className="w-full cursor-pointer py-3 "
    >
      <div className="flex gap-4 w-full px-2">
        <div>
          {comment.author?.profileImgUrl ? (
            <div>
              {comment.author?.profileImgUrl.startsWith("#") ? (
                <div
                  style={{
                    backgroundColor: comment.author?.profileImgUrl,
                  }}
                  className="rounded-full w-10 h-10 flex items-center justify-center capitalize"
                >
                  {comment.author?.firstName.slice(0, 1)}
                </div>
              ) : (
                <Image
                  src={comment.author?.profileImgUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
              )}
            </div>
          ) : (
            <div className="rounded-full w-10 h-10 bg-blue-900 flex items-center justify-center capitalize">
              {comment?.author?.firstName.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="w-full px-4">
          <div className="flex justify-between w-full ">
            <div className="flex gap-1 items-center">
              <p className="capitalize font-[600] text-[17px]">
                {comment.author?.firstName}
              </p>
              <p className="gray font-[300]">@{comment.author?.userName}</p>
              <p>
                <LuDot className="gray font-[300]" />
              </p>
              <p className="gray font-[300]">5h</p>
            </div>
            <div>
              <IoEllipsisHorizontal className="gray" />
            </div>
          </div>
          <Link href={`/${comment?.author.userName}/comment/${comment.id}`}>
            <div>{comment?.content}</div>
          </Link>
          {/* <div className="py-2">
            <Image
              alt=""
              width={200}
              height={200}
              src="/img.jpg"
              className="w-full rounded-[10px]"
            />
          </div> */}
          <div className="flex justify-between py-2 pt-3 pb-4">
            <ReplyComment comment={comment} user={user!} />
            <div className="flex gap-1 items-center gray text-[13px] font-[400]">
              <LuRepeat2 className="text-[20px] " />
              34k
            </div>
            <div
              onClick={() => handleTweetLike(comment.id)}
              className="flex gap-1 items-center gray text-[13px] cursor-pointer font-[400]"
            >
              {liked ? (
                <FaHeart className="text-[20px] heart-animation text-red-500" />
              ) : (
                <CiHeart className="text-[20px] " />
              )}
              <p className={`${liked ? "text-red-500" : "gray"}`}>
                {comment.likes.length}
              </p>
            </div>
            <div className="flex gap-1 items-center gray text-[13px] font-[400]">
              <IoShareOutline className="text-[20px] " />
            </div>
            <SaveComment singleComment={comment} user={user} />
          </div>
        </div>
      </div>
      <DivisionBar type="x" />
    </div>
  );
};

export default SingleCommentReply;
