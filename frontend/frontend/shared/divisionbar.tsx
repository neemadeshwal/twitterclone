import React from "react";

const DivisionBar = ({ type }: { type: "y" | "x" }) => {
  return (
    <div
      style={{
        width: type === "x" ? "w-full" : "1px",
        height: type === "x" ? "1px" : "h-full",
        backgroundColor: "#4949498e",
      }}
      className={` ${
        type === "x" ? "w-full h-px" : "h-full w-px"
      }  rounded-full`}
    ></div>
  );
};

export default DivisionBar;
