import { followUser, unfollowUser } from "@/graphql/mutation/follows";
import { authorType } from "@/graphql/types";
import { useCurrentUser } from "@/hooks/user";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import PortalContainerWrapper from "./PortalContainerWrapper";
import CenterDialog from "./CenterDialog";

const FollowUserBtn = ({ hoveredUser }: { hoveredUser: authorType }) => {
  const { user } = useCurrentUser();
  const [isAlreadyFollowing, setIsAlreadyFollowing] = useState(false);
  const [onhoverFollowing, setOnhoverFollowing] = useState(false);
  const [isFollowingClicked, setIsFollowingClicked] = useState(false);
  useEffect(() => {
    if (!hoveredUser || !user) {
      return;
    }

    const isFollowing = hoveredUser?.followers.find(
      (item) => item.followerId === user.id
    );
    if (isFollowing) {
      setIsAlreadyFollowing(true);
    } else {
      setIsAlreadyFollowing(false);
    }
  }, [hoveredUser, user]);

  const mutation = useMutation({
    mutationFn: followUser,
    onSuccess: (response: any) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const unFollowMutation = useMutation({
    mutationFn: unfollowUser,
    onSuccess: (response: any) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleFollowUser = async () => {
    if (!hoveredUser?.id) {
      return;
    }
    const body = {
      userToFollowId: hoveredUser.id,
    };
    try {
      await mutation.mutateAsync(body);
      setIsAlreadyFollowing(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollowUser = async () => {
    if (!hoveredUser?.id) {
      return;
    }
    const body = {
      userToUnfollowId: hoveredUser.id,
    };
    try {
      await unFollowMutation.mutateAsync(body);
      setIsAlreadyFollowing(false);
      setIsFollowingClicked(false);
    } catch (error) {
      console.log(error);
    }
  };
  const dialogElement = isFollowingClicked ? (
    <CenterDialog
      title={`Unfollow @${hoveredUser.userName}`}
      content="Their posts will no longer show up in your For You timeline. You can still view their profile, unless their posts are protected."
      actionBtn={{
        name: "unfollow",
        action: handleUnfollowUser,
      }}
      setCloseDialog={setIsFollowingClicked}
    />
  ) : null;

  return (
    <div>
      {isAlreadyFollowing ? (
        <PortalContainerWrapper
          isDialogTriggered={isFollowingClicked}
          triggerComp={
            <button
              onClick={() => {
                setIsFollowingClicked(true);
                setOnhoverFollowing(false);
              }}
              onMouseEnter={() => setOnhoverFollowing(true)}
              onMouseLeave={() => setOnhoverFollowing(false)}
              className={`${
                onhoverFollowing
                  ? "border-red-500 text-red-500 bg-[#38131385]"
                  : "border-gray-600 text-white"
              } px-4 py-1 rounded-full border capitalize font-[600]`}
            >
              {onhoverFollowing ? "unfollow" : "following"}
            </button>
          }
          element={dialogElement}
        />
      ) : (
        <button
          onClick={handleFollowUser}
          className="px-4 py-1 rounded-full bg-white hover:bg-[#ffffffbf] text-black capitalize font-[600]"
        >
          follow
        </button>
      )}
    </div>
  );
};

export default FollowUserBtn;
