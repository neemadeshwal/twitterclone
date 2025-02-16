import PostDetail from "@/components/postDetail/postDetail";
import { getCurrentUserData } from "@/lib/ServerFetchApi/ServerSideFunc";
import React from "react";

const Page = async () => {
  const user = await getCurrentUserData();

  return <PostDetail user={user} />;
};

export default Page;
