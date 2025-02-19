import { Tweet } from "@/graphql/types";
import React from "react";
import SinglePost from "../post/SinglePost/singlePost";
import SingleComment from "../postDetail/singleComment";

const LikeTab = ({ postlist }: { postlist: any }) => {
  console.log(postlist, "postlist");

  return (
    <div>
      <div>
        {postlist &&
          postlist.length !== 0 &&
          postlist.map((item) => {
            if (item.commentId) {
              return (
                <SingleComment comment={item.comment} key={item.commentId} />
              );
            }
            return <SinglePost tweet={item.tweet} key={item.id} />;
          })}
      </div>
    </div>
  );
};

export default LikeTab;
