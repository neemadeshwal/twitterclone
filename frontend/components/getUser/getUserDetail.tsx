"use client";
import { usePathname } from "next/navigation";
import React from "react";
import Home from "../home/home";

const UserDetail = () => {
  const pathname = usePathname();
  console.log(pathname, "pathname");
  return <Home pathType={pathname} />;
};

export default UserDetail;
