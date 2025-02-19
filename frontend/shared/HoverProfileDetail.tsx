import { useEffect, useState } from "react";
import { useCurrentUser, useGetUserByUserName } from "@/hooks/user";
import AuthorProfile from "./AuthorProfile";
import FollowUserBtn from "./followUserBtn";

const HoverProfileDetail = ({ hoverId }: { hoverId: string }) => {
  const [commonFollowers, setCommonFollowers] = useState<any>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { user: hoveredUser, isLoading } = useGetUserByUserName(hoverId);
  const { user } = useCurrentUser();

  useEffect(() => {
    if (hoverId) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [hoverId]);

  useEffect(() => {
    if (!hoveredUser || !user) return;

    const userFollowers = hoveredUser.followers || [];
    const currentUserFollowing = user.followingList || [];
    const common = currentUserFollowing.filter((following) =>
      userFollowers.some(
        (follower) => follower.followerId === following.followingId
      )
    );
    setCommonFollowers(common);
  }, [hoveredUser, user]);

  if (isLoading || !hoveredUser) return null;

  return (
    <div
      className={`
      relative z-[100]
      transform transition-all duration-300 ease-in-out
      
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
    `}
    >
      <div className={`absolute z-[1000]  top-2 left-0 `}>
        <div
          style={{
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
          }}
          className={`
            rounded-[15px] w-[290px] min-h-[100px] h-auto bg-black
            transform transition-all duration-300 ease-in-out
            ${isVisible ? "scale-100" : "scale-95"}
          `}
        >
          <div className="p-4">
            <div className="justify-between flex">
              {<AuthorProfile author={hoveredUser} />}
              {user?.id !== hoveredUser?.id && (
                <FollowUserBtn hoveredUser={hoveredUser} />
              )}
            </div>

            {/* Profile Info */}
            <div className="mt-2">
              <div>
                <h4 className="font-semibold text-lg">
                  {hoveredUser.firstName} {hoveredUser?.lastName}
                </h4>
              </div>

              <div className="gray text-[14px]">@{hoveredUser.userName}</div>

              {hoveredUser.bio && (
                <div className="py-2 text-sm">{hoveredUser.bio}</div>
              )}

              {/* Stats */}
              <div className="flex gap-3 items-center mt-2">
                <div>
                  <span className="font-medium">
                    {hoveredUser.followingList?.length}
                  </span>{" "}
                  <span className="gray text-[14px]">Following</span>
                </div>
                <div>
                  <span className="font-medium">
                    {hoveredUser.followers?.length}
                  </span>{" "}
                  <span className="text-[14px] gray">Followers</span>
                </div>
              </div>

              {/* Common Followers */}
              {user?.id !== hoveredUser?.id && commonFollowers.length > 0 && (
                <div className="mt-3 flex gap-1 items-center">
                  <div className="relative">
                    {commonFollowers.map((follower: any, index: number) => (
                      <div key={follower.followerId+index}>
                        <AuthorProfile
                          isSmall={true}
                          author={follower.following}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="gray text-[13px]">Followed by</div>
                  <div className="text-sm gray">
                    {commonFollowers.map((follower: any, index: number) => (
                      <span key={follower.followerId+index} className="capitalize">
                        {follower.following?.firstName}{" "}
                        {follower.following?.lastName}
                        {index < commonFollowers.length - 1 ? ", " : ""}
                      </span>
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
