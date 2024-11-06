import DivisionBar from "@/shared/divisionbar";
import React from "react";
import RightSidebar from "./rightSide/rightside";
import MiddlePost from "./middlePost/middlePost";
import Sidebar from "./leftSide/sidebar";
import UserDetail from "../getUser/UserDetail";

const Home = ({ pathType }: { pathType: string }) => {
  return (
    <div className="h-full min-h-screen">
      <div className="px-[100px] flex justify-between h-full pr-[80px] ">
        <div className="h-full w-[7%] ">
          <div className="fixed left-[8.8%] h-full flex gap-3">
            <div className=" h-full">
              <Sidebar />
            </div>
            <div className="h-full ">
              <DivisionBar type="y" />
            </div>
          </div>
        </div>
        <div className="w-[56%] h-full">
          {pathType?.startsWith("/@") ? <UserDetail /> : <MiddlePost />}
        </div>

        <div className="">
          <DivisionBar type="y" />
        </div>

        <div className="w-[37%] ">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default Home;
