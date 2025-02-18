import React from "react";
import { getCurrentUserData } from "@/lib/ServerFetchApi/ServerSideFunc";
import CommentDetail from "./commentDetail";
import PostDetailLayoutWrapper from "../postDetail/PostDetailLayout";

const CommentDetailComp = async () => {
  const user = await getCurrentUserData();
  return (
    <div>
      <PostDetailLayoutWrapper user={user}>
      <CommentDetail user={user}  />

      </PostDetailLayoutWrapper>
    </div>
  );
};

export default CommentDetailComp;
