import { Tweet } from "@/graphql/types";
import React from "react";
import SinglePost from "../post/SinglePost/singlePost";
import SingleComment from "../postDetail/singleComment";
import { Comment } from "@/graphql/types";

const CommentTab = ({ comment }: { comment: Comment[] }) => {
  return (
    <div>
      <div>
        {comment &&
          comment.length !== 0 &&
          comment.map((item) => {
            return <SingleComment comment={item} key={item.id} />;
          })}
      </div>
    </div>
  );
};

export default CommentTab;
