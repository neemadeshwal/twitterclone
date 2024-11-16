import { getCurrentUser, Tweet } from "@/graphql/types";
import DivisionBar from "@/shared/divisionbar";
import Image from "next/image";
import React, { useState } from "react";
import { MdOutlineCalendarMonth } from "react-icons/md";
import PostTab from "./postTab";
import CommentTab from "./commentTab";
import MediaTab from "./mediaTab";
import EditProfileContainer from "@/shared/editProfileContainer";

const ProfileDisplay = ({ user }: { user: getCurrentUser }) => {
  const [tabs, setTabs] = useState("post");
  console.log(user, "user tweet");
  console.log(user.likedTweets, "item liked");
  const [editProfileDialog, setEditProfileDialog] = useState(false);

  const LikedTweet: Tweet[] = [];
  if (user.likedTweets.length !== 0) {
    user.likedTweets.map((item) => {
      LikedTweet.push(item.tweet);
    });
  }
  console.log(LikedTweet, "likedtweet");

  const media =
    user.posts.length !== 0 &&
    user.posts.filter(
      (post) => post.photoArray.length !== 0 || post.videoArray.length !== 0
    );
  console.log(media, "media");
  return (
    <div>
      <div className="relative">
        {user?.coverImgUrl ? (
          <div>
            <Image src={user.coverImgUrl} alt="" height="100" width="100" />
          </div>
        ) : (
          <div className="bg-[#3a3a3acd] w-full h-[170px]"></div>
        )}
        <div className="absolute bottom-[-10px] left-4">
          {user?.profileImgUrl ? (
            <div>
              {user?.profileImgUrl.startsWith("#") ? (
                <div
                  className="rounded-full w-[150px] text-[80px] border-4 border-black h-[150px] flex items-center justify-center capitalize"
                  style={{ backgroundColor: user?.profileImgUrl }}
                >
                  {user?.firstName.slice(0, 1)}
                </div>
              ) : (
                <Image
                  className="rounded-full w-[150px] h-[150px] border-black border-4"
                  src={user?.profileImgUrl}
                  alt=""
                  width={40}
                  height={40}
                />
              )}
            </div>
          ) : (
            <div className="rounded-full w-10 h-10 bg-purple-950 flex items-center justify-center capitalize">
              {user?.firstName.slice(0, 1)}
            </div>
          )}
        </div>
        <div className="flex justify-end w-full py-3 px-4">
          <div
            onClick={() => setEditProfileDialog(true)}
            className=" rounded-full py-2 px-4 border-[0.1px] capitalize border-white w-fit"
          >
            <h4>edit profile</h4>
          </div>
        </div>
      </div>
      <div className="">
        <div className="py-6">
          <div className="px-4">
            <h3 className="text-[20px] font-[800] capitalize">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="gray font-[14px]">{user?.userName}</p>
          </div>
          <div className="py-3 px-4">
            <p className="gray font-[14px] flex items-center gap-2">
              <span>
                <MdOutlineCalendarMonth />
              </span>
              Joined october 2024
            </p>
          </div>
          <div className="flex gap-4 text-[14px] gray capitalize px-4">
            <div>
              <span className="text-white">{user?.following.length}</span>{" "}
              Following
            </div>
            <div>
              <span className="text-white">{user?.followers.length}</span>{" "}
              followers
            </div>
          </div>
          <div className="py-1">
            <div className="flex items-center justify-between">
              <div
                style={{ color: tabs === "post" ? "white" : "#a2a2a2b9" }}
                onClick={() => setTabs("post")}
                className="capitalize relative py-4  gray w-fit cursor-pointer  px-9 hover:bg-[#1f1f1fb8]"
              >
                {/* <div className="relative w-fit h-full py-4 "> */}
                <p>posts</p>
                {tabs === "post" && (
                  <p className="absolute bottom-0 left-[24%]  bg-blue-500 w-[55%] h-1 rounded-full"></p>
                )}
                {/* </div> */}
              </div>
              <div
                style={{ color: tabs === "replies" ? "white" : "#a2a2a2b9" }}
                onClick={() => setTabs("replies")}
                className="capitalize relative gray w-fit cursor-pointer p-4 px-9 hover:bg-[#1f1f1fb8]"
              >
                <p>replies</p>
                {tabs === "replies" && (
                  <p className="absolute bottom-0 left-[24%]  bg-blue-500 w-[55%] h-1 rounded-full"></p>
                )}
              </div>
              <div
                style={{ color: tabs === "articles" ? "white" : "#a2a2a2b9" }}
                onClick={() => setTabs("articles")}
                className="capitalize relative gray w-fit cursor-pointer p-4 px-9 hover:bg-[#1f1f1fb8]"
              >
                <p>articles</p>
                {tabs === "articles" && (
                  <p className="absolute bottom-0 left-[24%]  bg-blue-500 w-[55%] h-1 rounded-full"></p>
                )}
              </div>
              <div
                style={{ color: tabs === "media" ? "white" : "#a2a2a2b9" }}
                onClick={() => setTabs("media")}
                className="capitalize relative gray w-fit cursor-pointer p-4 px-9 hover:bg-[#1f1f1fb8]"
              >
                <p>media</p>
                {tabs === "media" && (
                  <p className="absolute bottom-0 left-[24%]  bg-blue-500 w-[55%] h-1 rounded-full"></p>
                )}
              </div>
              <div
                style={{ color: tabs === "likes" ? "white" : "#a2a2a2b9" }}
                onClick={() => setTabs("likes")}
                className="capitalize relative gray w-fit cursor-pointer p-4 px-9 hover:bg-[#1f1f1fb8]"
              >
                <p>likes</p>
                {tabs === "likes" && (
                  <p className="absolute bottom-0 left-[24%]  bg-blue-500 w-[55%] h-1 rounded-full"></p>
                )}
              </div>
            </div>
            <DivisionBar type="x" />
          </div>
          {tabs === "post" ? (
            <PostTab postlist={user.posts} />
          ) : tabs === "replies" ? (
            <CommentTab comment={user.commentTweets} />
          ) : tabs === "likes" ? (
            <PostTab postlist={LikedTweet} />
          ) : tabs === "media" ? (
            media && media.length !== 0 && <MediaTab mediaPost={media} />
          ) : (
            <div>hello</div>
          )}
        </div>
      </div>
      {editProfileDialog && (
        <EditProfileContainer setEditProfileDialog={setEditProfileDialog} />
      )}
    </div>
  );
};

export default ProfileDisplay;
