import React from "react";
import HoverWrapper from "../singlePost/HoverWrapper";
import AuthorProfile from "../AuthorProfile";
import { Tweet,Comment } from "@/graphql/types";
import PostControlDialog from "../singlePost/postControlDialog";

const PostAuthorInfo = ({ tweet }: { tweet: Tweet|Comment }) => {
  return (
    <div>
      <div className="flex justify-between p-2 items-start">
        <div className="flex items-start gap-1 w-full py-2 relative">
          <div className="pr-4">
            <HoverWrapper userId={tweet?.author.id}>
              <AuthorProfile author={tweet?.author} />
            </HoverWrapper>
          </div>
          <div className="">
            <HoverWrapper userId={tweet.author?.id}>
              <div className=" gap-1  flex-col flex">
                <p className="capitalize font-[600] md:text-[17px] hover:underline text-[15px] leading-[20px]">
                  {tweet.author?.firstName} {tweet.author?.lastName}
                </p>
                <p className="hidden xs:inline-block gray font-[300]">
                  @{tweet.author?.userName}
                </p>
              </div>
            </HoverWrapper>
          </div>
        </div>
        <div className="relative mt-4">
          <PostControlDialog tweet={tweet} />
        </div>
      </div>
    </div>
  );
};

export default PostAuthorInfo;
