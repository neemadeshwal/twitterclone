import React from "react";
import PostDetail from "../postDetail/postDetail";
import { getCurrentUserData } from "@/lib/ServerFetchApi/ServerSideFunc";

const CommentDetailComp = async () => {
  const user = await getCurrentUserData();
  return (
    <div>
      <PostDetail user={user} isComment={true} />
    </div>
  );
};

export default CommentDetailComp;
