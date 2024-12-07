"use client";
import { useEffect, useState } from "react";
import { useCurrentUser, useGetUserById } from "@/hooks/user";
import Image from "next/image";

const HoverProfileDetail = ({ user }: any) => {
  const [isFollowingCommon, setIsFollowingCommon] = useState<any>([]);

  // Correctly using the hook inside the component body
  const [hoveredUserId, setHoveredUserId] = useState<string>("");

  const { user: currentUser } = useCurrentUser();

  // Refetch when hoveredUserId changes useEffect(() => { if (hoveredUser) { setUser(hoveredUser); // Set the user data when it's loaded } }, [hoveredUser]);

  useEffect(() => {
    if (!user || !currentUser) {
      return;
    }

    const userFollowers = user?.followers || [];
    const currentUserFollowing = currentUser?.following || [];

    if (userFollowers.length === 0 || currentUserFollowing.length === 0) {
      return;
    }

    const commonItem = currentUserFollowing.filter((item) =>
      userFollowers.includes(item)
    );

    if (commonItem.length === 0) {
      return;
    }

    setIsFollowingCommon(commonItem);
  }, [user, currentUser]);

  if (!user) {
    return; // Fallback UI when user data is missing or id is invalid
  }

  return (
    <div className="relative z-50">
      <div className="absolute z-50 top-12 left-[-4px]">
        <div
          style={{
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
          }}
          className="rounded-[15px] w-[290px] min-h-[100px] h-auto bg-black"
        >
          <div className="p-4">
            <div className="justify-between flex">
              <div>
                {user?.profileImgUrl ? (
                  <div>
                    {user?.profileImgUrl.startsWith("#") ? (
                      <div
                        style={{ backgroundColor: user?.profileImgUrl }}
                        className="rounded-full w-12 h-12 flex items-center justify-center capitalize"
                      >
                        {user.firstName.slice(0, 1)}
                      </div>
                    ) : (
                      <Image
                        src={user.profileImgUrl}
                        alt="style one"
                        width={40}
                        height={40}
                        className="rounded-full w-12 h-12"
                      />
                    )}
                  </div>
                ) : (
                  <div className="rounded-full w-12 h-12 bg-blue-900 flex items-center justify-center capitalize">
                    {user?.firstName.slice(0, 1)}
                  </div>
                )}
              </div>
              <button className="bg-white text-black px-4 py-[0.4rem] h-fit font-[600] capitalize rounded-full">
                follow
              </button>
            </div>
            <div>
              <div>
                <h4>
                  {user?.firstName} {user?.lastName}
                </h4>
              </div>

              <div className="gray text-[14px]">@{user?.userName}</div>
              <div className="py-2">{user?.bio}</div>
              <div className="flex gap-3 items-center">
                <div>
                  {user?.following?.length}{" "}
                  <span className="gray text-[14px]">Following</span>
                </div>
                <div>
                  {user?.followers?.length}{" "}
                  <span className="text-[14px] gray">Followers</span>
                </div>
              </div>
              {isFollowingCommon.length > 0 && (
                <div>
                  <div className="gray text-[14px]">Followed by</div>
                  <div>
                    {isFollowingCommon.map((item: any, index: number) => (
                      <div key={index}>
                        {item.firstName} {item?.lastName}
                        {index < isFollowingCommon.length - 1 && ","}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoverProfileDetail;
