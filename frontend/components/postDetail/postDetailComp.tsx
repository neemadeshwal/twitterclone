import { getCurrentUserData } from "@/lib/ServerFetchApi/ServerSideFunc";
import React from "react";
import PostDetail from "./postDetail";
import PostDetailLayoutWrapper from "./PostDetailLayout";

const PostDetailComp = async () => {
  const user = await getCurrentUserData();

  return (
      <PostDetailLayoutWrapper user={user}>
      <PostDetail user={user} />

      </PostDetailLayoutWrapper>
  );
};

export default PostDetailComp;
