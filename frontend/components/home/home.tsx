import DivisionBar from "@/shared/divisionbar";
import React from "react";
import RightSidebar from "./rightSide/rightside";
import MiddlePost from "./middlePost/middlePost";
import Sidebar from "./leftSide/sidebar";
import HorizontalSidebar from "./horizontalSidebar";
import { getCurrentUserData } from "@/lib/ServerFetchApi/ServerSideFunc";

const Home = async () => {
  const user = await getCurrentUserData();

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <div className="flex-1 flex flex-col sm:flex-row px-0 md:px-[100px] lg:px-[20px] xl1300:px-[40px]">
        {/* Left sidebar - keep as is */}
        <aside className="hidden sm:flex flex-col w-[7%] sm:w-[10%] md:w-[11%] justify-center xl1300:w-[20%] sticky top-0 h-screen">
          <div className="flex h-full w-full">
            <div className="flex-grow">
              <Sidebar currentUser={user} />
            </div>
            <div className="h-full">
              <DivisionBar type="y" />
            </div>
          </div>
        </aside>

        {/* Main content (middle section) */}
        <main className="w-full sm:w-[80%] md:w-[95%] md:max-w-[700px] lg:max-w-full lg:w-[60%] xl1300:w-[50%]">
          <MiddlePost user={user} />
        </main>

        <div className="hidden lg:block">
          <DivisionBar type="y" />
        </div>

        {/* Right sidebar - with sticky positioning after initial scroll */}
        <div className="hidden lg:block lg:w-[33%] xl1300:w-[30%]">
          <div className="sticky top-0 max-h-screen overflow-y-auto">
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Mobile navigation - keep as is */}
      <nav className="sm:hidden">
        <HorizontalSidebar currentUser={user} />
      </nav>
    </div>
  );
};

export default Home;
