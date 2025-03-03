"use client";
import React from "react";
import Loading from "./loading";
import { useAuth } from "@/context/authContext";
import ReactDOM from "react-dom";

const AuthLoading = () => {
  const element = (
    <div className="bg-black">
      <Loading />
    </div>
  );
  const { isAuthLoading } = useAuth();
  if (isAuthLoading) {
    return (
      <div>
        {isAuthLoading && ReactDOM.createPortal(element, document.body)}
      </div>
    );
  }
  return null;
};

export default AuthLoading;
