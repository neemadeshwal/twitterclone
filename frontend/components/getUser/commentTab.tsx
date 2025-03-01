import React from "react";
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
