import React from "react";

const DivisionBar = ({ type, width }: { type: "y" | "x"; width?: number }) => {
  return (
    <div
      style={{
        width: type === "x" ? "w-full" : `${width ? `${width}px` : "1px"}`,
        height: type === "x" ? "1px" : "h-full",
        backgroundColor: "#4949498e",
      }}
      className={`${
        type === "x"
          ? "w-full h-px"
          : `h-full ${width ? `${width} px` : "1px"} `
      }  rounded-full`}
    ></div>
  );
};

export default DivisionBar;
