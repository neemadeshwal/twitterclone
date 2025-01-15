import DivisionBar from "@/shared/divisionbar";
import React from "react";
import RightSidebar from "@/components/home/rightSide/rightside";
import MiddlePost from "@/components/home//middlePost/middlePost";
import Sidebar from "@/components/home/leftSide/sidebar";
import UserDetail from "../getUser/UserDetail";
import SearchPage from "./searchPage";
import HorizontalSidebar from "../home/horizontalSidebar";

const Explore = ({ pathType }: { pathType: string }) => {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Main content wrapper with padding */}
      <div className="flex-1 flex flex-col sm:flex-row px-0 lg:px-[100px] md:px-[100px]">
        {/* Left Sidebar - Desktop */}
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

        {/* Middle Content */}
        <main className=" w-full sm:w-[80%] md:w-[95%] middle-width md:max-w-[700px] lg:max-w-full lg:w-[63%] xl:w-[56%]">
         <SearchPage/>          
        </main>

        {/* Division Bar for Desktop */}
        <div className="hidden lg:block">
          <DivisionBar type="y" />
        </div>

        {/* Right Sidebar - Desktop */}
        <div className="hidden lg:block  lg:w-[30%] xl:w-[37%] right-width">
          <RightSidebar />
        </div>
      </div>

      {/* Mobile Horizontal Sidebar */}
      <div className="sm:hidden">
        <HorizontalSidebar />
      </div>
    </div>
  );
};

export default Explore;
