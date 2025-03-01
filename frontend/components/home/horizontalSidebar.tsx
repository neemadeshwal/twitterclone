"use client";
import React, { useEffect, useState } from "react";
import SideIcons from "./leftSide/leftSideComp/SideIcons";
import { getCurrentUser } from "@/graphql/types";

const HorizontalSidebar = ({
  currentUser,
}: {
  currentUser: getCurrentUser | null;
}) => {
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("");

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const currentScroll = window.scrollY;

        if (currentScroll > lastScrollTop) {
          setScrollDirection("down");
        } else if (currentScroll < lastScrollTop) {
          setScrollDirection("up");
        }
        setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll); // Ensure scrollTop doesn't go negative
      }, 100);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(debounceTimer);
    };
  }, [lastScrollTop]);

  return (
    <div className="fixed bottom-0 w-full ">
      <div
        className={` w-full px-6 py-1 overflow-hidden transition-[height] bg-black duration-100 ${
          scrollDirection === "down" ? "h-0" : "h-16"
        }`}
      >
        <SideIcons position="x" currentUser={currentUser} />
      </div>
    </div>
  );
};

export default HorizontalSidebar;
