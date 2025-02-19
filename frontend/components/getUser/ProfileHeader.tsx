import { authorType } from "@/graphql/types";
import Image from "next/image";
import { MdLocationPin, MdOutlineCalendarMonth } from "react-icons/md";

type ProfileHeaderProps = {
  user: authorType;
  onEditProfile: () => void;
};

const ProfileHeader = ({ user, onEditProfile }: ProfileHeaderProps) => {
  const ProfileImage = () => {
    if (!user.profileImgUrl) {
      return (
        <div className="rounded-full w-10 h-10 bg-purple-950 flex items-center justify-center capitalize">
          {user.firstName.slice(0, 1)}
        </div>
      );
    }

    if (user.profileImgUrl.startsWith("#")) {
      return (
        <div
          className="rounded-full w-[150px] text-[80px] border-4 border-black h-[150px] flex items-center justify-center capitalize"
          style={{ backgroundColor: user.profileImgUrl }}
        >
          {user.firstName.slice(0, 1)}
        </div>
      );
    }

    return (
      <Image
        className="rounded-full w-[150px] h-[150px] border-black border-4"
        src={user.profileImgUrl}
        alt={`${user.firstName}'s profile`}
        width={40}
        height={40}
      />
    );
  };

  return (
    <div className="relative">
      {user.coverImgUrl ? (
        <Image
          className="w-full h-[170px]"
          src={user.coverImgUrl}
          alt="Cover"
          height={100}
          width={100}
        />
      ) : (
        <div className="bg-[#3a3a3acd] w-full h-[170px]" />
      )}
      
      <div className="absolute bottom-[-10px] left-4">
        <ProfileImage />
      </div>
      
      <div className="flex justify-end w-full py-3 px-4">
        <button
          onClick={onEditProfile}
          className="rounded-full py-2 cursor-pointer px-4 border-[0.1px] capitalize border-white w-fit"
        >
          edit profile
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader