import DivisionBar from "@/shared/divisionbar";
import React from "react";
import RightSidebar from "./rightSide/rightside";
import MiddlePost from "./middlePost/middlePost";
import Sidebar from "./leftSide/sidebar";
import HorizontalSidebar from "./horizontalSidebar";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <div className="flex-1 flex flex-col sm:flex-row px-0  md:px-[100px]">
        <div className="hidden sm:flex flex-col w-[7%] justify-center  left-width sticky top-0 h-screen">
          <div className="flex h-full">
            <div className="flex-grow">
              <Sidebar />
            </div>
            <div className="h-full">
              <DivisionBar type="y" />
            </div>
          </div>
        </div>

        <main className=" w-full sm:w-[80%] md:w-[95%] middle-width md:max-w-[700px] lg:max-w-full lg:w-[63%] xl:w-[56%]">
          <MiddlePost />
        </main>

        <div className="hidden lg:block">
          <DivisionBar type="y" />
        </div>

        <div className="hidden lg:block  lg:w-[30%] xl:w-[37%] right-width">
          <RightSidebar />
        </div>
      </div>

      <div className="sm:hidden">
        <HorizontalSidebar />
      </div>
    </div>
  );
};

export default Home;
