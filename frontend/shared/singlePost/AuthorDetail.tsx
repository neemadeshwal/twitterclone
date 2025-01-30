import { authorType } from '@/graphql/types';
import { formatTimeAgo, getDateTime } from '@/lib/timeStamp';
import React from 'react'
import { IoEllipsisHorizontal } from 'react-icons/io5';
import { LuDot } from 'react-icons/lu';

const AuthorDetail = ({author,createdAt}:{author:authorType,createdAt:string}) => {
  return (
    <div>
          <div className="flex justify-between w-full">
            <div
            //   onMouseEnter={() => {
            //     setIsHoveredOnProfileImgId(tweet.author.id);
            //     setHoveredUserId(tweet.author.id);
            //     setHoverOnName(true);
            //   }}
            //   onMouseLeave={() => {
            //     setIsHoveredOnProfileImgId("");
            //     setHoveredUserId("");
            //     setHoverUser(null);
            //     setHoverOnName(false);
            //   }}
              className="flex flex-col sm:flex-row items- sm:gap-1 sm:items-center"
            >
              <div className="flex gap-1 items-center">
                <p className="capitalize font-[600] md:text-[17px] text-[15px] leading-[20px]">
                  {author?.firstName}
                </p>
                <p className="hidden sm:inline-block gray font-[300]">
                  @{author?.userName}
                </p>
              </div>
              <div className="flex items-center sm:items-start">
                <p className="sm:hidden gray text-[15px] leading-[19px] font-[400]">
                  @{author?.userName}
                </p>

                <p>
                  <LuDot className="gray font-[300]" />
                </p>

                <p className="gray text-[14px] md:text-[16px] leading-[19px] font-[300]">
                  {formatTimeAgo(getDateTime(createdAt))}
                </p>
              </div>
            </div>

            <div className="" >
              <div className="p-2 rounded-full absolute right-8 hover:bg-[#1e2034a5] gray hover:text-blue-500 hidden md:inline-block">
                <IoEllipsisHorizontal className="" />

                {/* {isPostControlDialogOpen && (
                  <PostActivity
                    singleTweet={tweet}
                    setPostControlDialogOpen={setPostControlDialogOpen}
                  />
                )} */}
              </div>
            </div>

            {/* <DrawDialog
              drawerTrigger={<IoEllipsisVertical className="gray" />}
              drawerComp={
                <PostActivity
                  isDrawer={true}
                  singleTweet={tweet}
                  setPostControlDialogOpen={setPostControlDialogOpen}
                  setIsTriggerDrawerOpen={setIsDrawerOpen}
                />
              }
              setIsOpenProp={setIsDrawerOpen}
            /> */}
          </div>
    </div>
  )
}

export default AuthorDetail