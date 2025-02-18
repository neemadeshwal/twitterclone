import React from "react";
import PostDetailLayoutWrapper from "../postDetail/PostDetailLayout";
import { getCurrentUserData } from "@/lib/ServerFetchApi/ServerSideFunc";
import UserDetail from "./UserDetail";

const GetUserDetail = async () => {
  const user = await getCurrentUserData();

  return (
    <PostDetailLayoutWrapper user={user}>
      <UserDetail />
    </PostDetailLayoutWrapper>
  );
};

export default GetUserDetail;
