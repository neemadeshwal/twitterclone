import DivisionBar from "@/shared/divisionbar";
import React from "react";
import RightSidebar from "@/components/home/rightSide/rightside";
import Sidebar from "@/components/home/leftSide/sidebar";
import PostDetail from "@/components/postDetail/postDetail";

const SinglePost = () => {
  return (
    <div className="h-full min-h-screen">
      <div className="px-[110px] flex justify-between h-full pr-[80px] ">
        <div className="h-full w-[7%] ">
          <div className="fixed h-full flex gap-4">
            <div className=" h-full">
              <Sidebar />
            </div>
            <div className="h-full ">
              <DivisionBar type="y" />
            </div>
          </div>
        </div>
        <div className="w-[60%] h-full">
          <PostDetail />
        </div>

        <div className="">
          <DivisionBar type="y" />
        </div>

        <div className="w-[33%] ">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
