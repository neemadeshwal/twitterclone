"use client";
import { followUser } from "@/graphql/mutation/follows";
import { getCurrentUser } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const SingleFollowUser = ({
  singleUser,
  filterArray,
}: {
  singleUser: getCurrentUser;
  filterArray?: boolean;
}) => {
  const { user } = useCurrentUser();
  const [isAlreadyFollowing, setIsAlreadyFollowing] = useState(false);

  const mutation = useMutation({
    mutationFn: followUser,
    onSuccess: (response: any) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleFollowUser = async () => {
    if (!singleUser.id) {
      return;
    }
    const body = {
      userToFollowId: singleUser.id,
    };
    try {
      await mutation.mutateAsync(body);
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
            {singleUser.profileImgUrl ? (
              <div>
                {singleUser.profileImgUrl.startsWith("#") ? (
                  <div className=" flex items-center justify-center capitalize  cursor-pointer">
                    <p
                      style={{ backgroundColor: singleUser?.profileImgUrl }}
                      className=" rounded-full w-10 h-10 flex items-center justify-center "
                    >
                      {singleUser?.firstName.slice(0, 1)}
                    </p>
                  </div>
                ) : (
                  <Image
                    src={singleUser?.profileImgUrl}
                    alt=""
                    width={100}
                    height={100}
                    className="w-10 h-10 rounded-full"
                  />
                )}
              </div>
            ) : (
              <div className=" flex items-center justify-center capitalize  cursor-pointer">
                <p className="bg-green-900 rounded-full w-10 h-10 flex items-center justify-center ">
                  {singleUser?.firstName.slice(0, 1)}
                </p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-[16px] font-[500] capitalize hover:underline underline-white cursor-pointer">
              {singleUser?.firstName} {singleUser?.lastName}
            </h3>
            <p className="gray text-[14px] font-[300] break-all">
              @{singleUser?.userName}
            </p>
          </div>
        </div>
        <div>
          {isAlreadyFollowing ? (
            <button className="px-4 py-1 rounded-full border border-gray-600 capitalize font-[600]">
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
