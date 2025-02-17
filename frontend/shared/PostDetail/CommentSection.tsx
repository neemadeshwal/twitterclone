import ComposePost from "@/components/post/compostPost";
import SingleComment from "@/components/postDetail/singleComment";
import { authorType, Comment, Tweet } from "@/graphql/types";
import React from "react";

interface CommentSectionProps {
  user: authorType | null;
  tweet: Tweet|Comment;
  isComment?:boolean
  isParentComment?:boolean
}
const CommentSection = ({ user, tweet,isComment,isParentComment }: CommentSectionProps) => {
  const commentData = isComment
    ? "replies" in tweet
      ? tweet.replies
      : []  
    : "commentAuthor" in tweet
    ? tweet.commentAuthor
    : []
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
              <ComposePost isComment={true} isParentComment={isParentComment} user={user} tweetId={tweet.id} />
            </div>
          </div>
        </div>
      </div>

      <div>
        
        {commentData.length>0&&commentData.map((item:Comment) => {
          return <SingleComment key={item.id} comment={item} />;
        })}
      </div>
    </div>
  );
};

export default CommentSection;
