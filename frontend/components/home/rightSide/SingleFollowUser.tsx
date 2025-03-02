"use client";
import { getCurrentUser } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import AuthorProfile from "@/shared/AuthorProfile";
import React, { useEffect, useState } from "react";
import DynamicNameTruncate from "./DynamicNameTruncate";
import { userUserMutation } from "@/hooks/mutation/useUserMutation";

const SingleFollowUser = ({
  singleUser,
  filterArray,
  isBio,
}: {
  singleUser: getCurrentUser;
  filterArray?: boolean;
  isBio?: boolean;
}) => {
  const { user } = useCurrentUser();
  const [isAlreadyFollowing, setIsAlreadyFollowing] = useState(false);

  const { followUserFn } = userUserMutation();
  const handleFollowUser = async () => {
    if (!singleUser.id) {
      return;
    }
    const body = {
      userToFollowId: singleUser.id,
    };
    try {
      await followUserFn(body);
      setIsAlreadyFollowing(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(singleUser, "singleUser");
    console.log(user, "user");
    console.log(filterArray, "fiilterararay");
    if (!singleUser || !user || !filterArray) {
      console.log("empty followers");
      return;
    }

    console.log(singleUser, "followers");
    const isFollowing = singleUser.followers.find(
      (item) => item.followerId === user.id
    );
    console.log(isFollowing, "following");
    if (isFollowing) {
      setIsAlreadyFollowing(true);
    } else {
      setIsAlreadyFollowing(false);
    }
  }, [singleUser, user, filterArray]);
  return (
    <div className="w-full">
      <div className="flex justify-between w-full">
        <div className="flex gap-2 items-center">
          <div>
            <AuthorProfile author={singleUser} />
          </div>
          <div>
            <h3 className="text-[14px] xl:text-[16px] font-[500] capitalize hover:underline underline-white cursor-pointer">
              <DynamicNameTruncate
                text={`${singleUser?.firstName} ${singleUser?.lastName}`}
              />
            </h3>
            <h4 className="gray text-[13px] xl:text-[14px] font-[300] break-all">
              <DynamicNameTruncate text={`@${singleUser?.userName}`} />
            </h4>
            {isBio && singleUser?.bio && (
              <DynamicNameTruncate text={`${singleUser?.bio}`} />
            )}
          </div>
        </div>
        <div>
          {isAlreadyFollowing ? (
            <button className="px-3 text-[14px] xl:text-[16px]  py-1 rounded-full border border-gray-600 capitalize font-[600]">
              following
            </button>
          ) : (
            <button
              onClick={handleFollowUser}
              className="px-4 py-1 rounded-full bg-white text-black capitalize font-[600]"
            >
              follow
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleFollowUser;
