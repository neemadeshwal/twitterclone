import React from "react";

import { getCurrentUser } from "@/graphql/types";
import PostButton from "./leftSideComp/PostButton";
import ProfileContainer from "./leftSideComp/ProfileContainer";
import MoreContainerTrigger from "./leftSideComp/MoreContainerTrigger";
import { Icons } from "@/utils/icons";
import SideIcons from "./leftSideComp/SideIcons";

const Sidebar = React.memo(
  ({ currentUser }: { currentUser: getCurrentUser | null }) => {
    return (
      <div className="flex flex-col h-full items-center justify-between">
        {/* Main content section */}
        <div className="flex-1">
          <div className="py-2">
            {/* Logo */}
            <div
              aria-label="Go to Twitter Home"
              className="p-3 w-fit  hover:bg-[#2a2a2abb] rounded-full"
            >
              <Icons.TwitterX className="text-[28px]" />
            </div>

            {/* Navigation Icons */}
            <SideIcons position="y" currentUser={currentUser} />

            {/* More Button */}
            <MoreContainerTrigger />

            {/* Post Button */}
            <PostButton />
          </div>
        </div>

        {/* Current User Section - Sticky */}
        <ProfileContainer currentUser={currentUser} />
      </div>
    );
  }
);

// Add display name
Sidebar.displayName = "Sidebar";

export default Sidebar;
