import { useEffect, useState } from "react";
import { useCurrentUser, useGetUserById } from "@/hooks/user";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { followUser } from "@/graphql/mutation/follows";

const HoverProfileDetail = ({ hoverId}: { hoverId: string }) => {
  const [commonFollowers, setCommonFollowers] = useState<any>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { user: hoveredUser, isLoading } = useGetUserById(hoverId);
  const { user } = useCurrentUser();
  const [isAlreadyFollowing, setIsAlreadyFollowing] = useState(false);
  const[onhoverFollowing,setOnhoverFollowing]=useState(false);
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
    const currentUserFollowing = user.following || [];
    console.log(user,"user dot following")
    console.log(userFollowers,"userfollowers")
    console.log(currentUserFollowing,"currentUserfollowing")
    const common = currentUserFollowing.filter(following => 
      userFollowers.some(follower => follower.followerId === following.followingId)
    );
    console.log(common,"common")
    setCommonFollowers(common);
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
  useEffect(() => {
    if (!hoveredUser || !user) {
      return;
    }

    const isFollowing = hoveredUser.followers.find(
      (item) => item.followerId === user.id
    );
    console.log(isFollowing, "following");
    if (isFollowing) {
      setIsAlreadyFollowing(true);
    } else {
      setIsAlreadyFollowing(false);
    }
  }, [hoveredUser, user]);

  console.log(commonFollowers,"common followers check")

  if (isLoading || !hoveredUser) return null;

 

  return (
    <div className={`
      relative z-[100]
      transform transition-all duration-300 ease-in-out
      
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
    `}>
      <div className={`absolute z-[1000]  top-2 left-0 `}>
        <div
          style={{
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
          }}
          className={`
            rounded-[15px] w-[290px] min-h-[100px] h-auto bg-black
            transform transition-all duration-300 ease-in-out
            ${isVisible ? 'scale-100' : 'scale-95'}
          `}
        >
          <div className="p-4">
            {/* Rest of your component content remains the same */}
            {/* Profile Header */}
            <div className="justify-between flex">
              <div>
                {hoveredUser.profileImgUrl ? (
                  hoveredUser.profileImgUrl.startsWith("#") ? (
                    <div
                      style={{ backgroundColor: hoveredUser.profileImgUrl }}
                      className="rounded-full w-12 h-12 flex items-center justify-center capitalize"
                    >
                      {hoveredUser.firstName.slice(0, 1)}
                    </div>
                  ) : (
                    <Image
                      src={hoveredUser.profileImgUrl}
                      alt={`${hoveredUser.firstName}'s profile`}
                      width={40}
                      height={40}
                      className="rounded-full w-12 h-12"
                    />
                  )
                ) : (
                  <div className="rounded-full w-12 h-12 bg-blue-900 flex items-center justify-center capitalize">
                    {hoveredUser.firstName.slice(0, 1)}
                  </div>
                )}
              </div>
              {
                user?.id!==hoveredUser?.id&&
                <div>
          {isAlreadyFollowing ? (
            
            <button  onMouseEnter={()=>setOnhoverFollowing(true)} onMouseLeave={()=>setOnhoverFollowing(false)} className={` ${onhoverFollowing?"border-red-500 text-red-500 bg-[#38131385]":"border-gray-600 text-white"} px-4 py-1 rounded-full border  capitalize font-[600]`}>
             {onhoverFollowing?"unfollow":"following"}
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
              }
             
            </div>

            {/* Profile Info */}
            <div className="mt-2">
              <div>
                <h4 className="font-semibold text-lg">
                  {hoveredUser.firstName} {hoveredUser.lastName}
                </h4>
              </div>

              <div className="gray text-[14px]">@{hoveredUser.userName}</div>
              
              {hoveredUser.bio && (
                <div className="py-2 text-sm">{hoveredUser.bio}</div>
              )}

              {/* Stats */}
              <div className="flex gap-3 items-center mt-2">
                <div>
                  <span className="font-medium">{hoveredUser.following?.length}</span>{" "}
                  <span className="gray text-[14px]">Following</span>
                </div>
                <div>
                  <span className="font-medium">{hoveredUser.followers?.length}</span>{" "}
                  <span className="text-[14px] gray">Followers</span>
                </div>
              </div>

              {/* Common Followers */}
              {commonFollowers.length > 0 && (
                <div className="mt-3">
                  <div className="gray text-[14px]">Followed by</div>
                  <div className="text-sm mt-1">
                    {commonFollowers.map((follower:any, index:number) => (
                      <span key={follower.followerId}>
                        {follower.followerId}
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