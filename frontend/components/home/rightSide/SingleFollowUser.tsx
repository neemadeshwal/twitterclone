"use client";
import { getCurrentUser } from "@/graphql/types";
import AuthorProfile from "@/shared/AuthorProfile";
import DynamicNameTruncate from "./DynamicNameTruncate";
import FollowUserBtn from "@/shared/followUserBtn";

const SingleFollowUser = ({
  singleUser,
  filterArray,
  isBio,
}: {
  singleUser: getCurrentUser;
  filterArray?: boolean;
  isBio?: boolean;
}) => {
  console.log(filterArray);
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
          <FollowUserBtn hoveredUser={singleUser} />
        </div>
      </div>
    </div>
  );
};

export default SingleFollowUser;
