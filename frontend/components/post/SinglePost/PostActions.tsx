import React from "react";
import Comment from "../comment";
import { LuRepeat2 } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import SharePost from "@/shared/sharePost";
import SavePost from "@/shared/savePost";

const PostActions = ({
  tweet,
  liked,
  repost,
  handleRepostTweet,
  handleTweetLike,
  isComment,
}: any) => {
  const shareLink = isComment
    ? `http://localhost:5000/${tweet?.author?.userName}/comment/${tweet?.id}`
    : `http://localhost:5000/${tweet?.author?.userName}/status/${tweet?.id}`;
  return (
    <div>
      <div className="flex justify-between py-2 pt-3 pb-4">
        <div className="flex items-center justify-center">
          <Comment tweet={tweet} isComment={isComment} />
        </div>
        <div
          onClick={handleRepostTweet}
          className={`flex gap-[2px] relative  ${
            repost ? "text-[#00ba7c]" : "gray group hover:text-[#00ba7c]"
          }  sm:gap-1 items-center gray text-[13px] font-[400]`}
        >
          <div className="p-2 rounded-full group-hover:bg-[#1e3429a5] ">
            <LuRepeat2
              className={` ${
                repost && "text-[#00ba7c]"
              } text-[16px] sm:text-[20px]`}
            />
          </div>
          <p
            className={` ${repost && "text-[#00ba7c]"}
                 ml-0 pl-0 -right-[0.3rem]  absolute`}
          >
            {isComment
              ? tweet?.repostComment?.length
              : tweet?.repostTweet?.length}
          </p>
        </div>
        <div
          onClick={handleTweetLike}
          className={`flex gap-[2px] relative ${
            liked ? "text-red-500" : "gray group "
          } sm:gap-1 items-center gray hover:text-red-500  text-[13px] cursor-pointer font-[400]`}
        >
          {liked ? (
            <div className="p-2 text-red-500 ">
              <FaHeart className="text-[16px] sm:text-[20px] heart-animation text-red-500" />
            </div>
          ) : (
            <div className="rounded-full p-2 group-hover:bg-[#341912a5]">
              <CiHeart className="text-[16px]  sm:text-[20px]" />
            </div>
          )}
          <p
            className={` ml-0 pl-0 ${
              liked && "text-red-500"
            } -right-[0.3rem]  absolute`}
          >
            {isComment ? tweet?.likes?.length : tweet?.likedBy?.length}
          </p>
        </div>
        {<SharePost link={shareLink} />}

        <SavePost isComment={isComment} singleTweet={tweet} />
      </div>
    </div>
  );
};

export default PostActions;
