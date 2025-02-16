import ComposePost from "@/components/post/compostPost";
import SingleComment from "@/components/postDetail/singleComment";
import { authorType, Comment, Tweet } from "@/graphql/types";
import React from "react";

interface CommentSectionProps {
  user: authorType | null;
  tweet: Tweet;
}
const CommentSection = ({ user, tweet }: CommentSectionProps) => {
  return (
    <div>
      <div className="">
        <div className="py-2  w-full">
          <div className="w-full  ">
            <div className="w-full  ">
              <div className="gray font-[500] text-[14px] px-16 ">
                Replying to{" "}
                <p className="x-textcolor inline">@{tweet?.author?.userName}</p>
              </div>
              <ComposePost isComment={true} user={user} tweetId={tweet.id} />
            </div>
          </div>
        </div>
      </div>

      <div>
        {tweet.commentAuthor.map((item) => {
          return <SingleComment key={item.id} comment={item} />;
        })}
      </div>
    </div>
  );
};

export default CommentSection;
