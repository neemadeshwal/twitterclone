import { getCurrentUserData } from "@/lib/ServerFetchApi/ServerSideFunc";
import React from "react";
import PostDetail from "./postDetail";

const PostDetailComp = async () => {
  const user = await getCurrentUserData();

  return (
    <div>
      <PostDetail user={user} />
    </div>
  );
};

export default PostDetailComp;
