import React from "react";
import { getCurrentUserData } from "@/lib/ServerFetchApi/ServerSideFunc";
import CommentDetail from "./commentDetail";

const CommentDetailComp = async () => {
  const user = await getCurrentUserData();
  return (
    <div>
      <CommentDetail user={user}  />
    </div>
  );
};

export default CommentDetailComp;
