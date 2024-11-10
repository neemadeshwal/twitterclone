"use client";
import DivisionBar from "@/shared/divisionbar";
import React, { useEffect, useState } from "react";
import RightSidebar from "@/components/home/rightSide/rightside";
import Sidebar from "@/components/home/leftSide/sidebar";
import PostDetail from "@/components/postDetail/postDetail";
import CommentDetail from "@/components/commentDetail/commentDetail";
import { usePathname } from "next/navigation";

const SinglePost = () => {
  const [id, setId] = useState("");
  const pathname = usePathname();
  useEffect(() => {
    const idArr = pathname.split("/");
    const id = idArr[idArr.length - 1];
    setId(id);
  }, [pathname]);
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
          <CommentDetail id={id} />
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
