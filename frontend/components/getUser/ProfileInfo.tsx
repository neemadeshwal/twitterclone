import { authorType } from "@/graphql/types";
import { MdLocationPin, MdOutlineCalendarMonth } from "react-icons/md";

const ProfileInfo = ({ user }: { user: authorType }) => (
    <div className="py-6 px-4">
      <h3 className="text-[20px] font-[800] capitalize">
        {user.firstName} {user.lastName}
      </h3>
      <p className="gray font-[14px]">@{user.userName}</p>
      
      {user.bio && (
        <p className="text-[14px] pt-4 pb-1">{user.bio}</p>
      )}
      
      <div className="flex items-center flex-wrap gap-1">
        {user.location && (
          <p className="gray font-[14px] flex items-center gap-2 py-3">
            <MdLocationPin />
            {user.location}
          </p>
        )}
        <p className="gray font-[14px] flex items-center gap-2 py-3">
          <MdOutlineCalendarMonth />
          Joined october 2024
        </p>
      </div>
  
      <div className="flex gap-4 text-[14px] gray capitalize">
        <div>
          <span className="text-white">{user.followingList.length}</span> Following
        </div>
        <div>
          <span className="text-white">{user.followers.length}</span> followers
        </div>
      </div>
    </div>
  );

  export default ProfileInfo