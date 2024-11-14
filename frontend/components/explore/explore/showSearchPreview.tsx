import React from "react";

const ShowSearchPreview = ({
  isSearchPreviewOpen,
  setIsSearchPreviewOpen,
}: any) => {
  return (
    <div
      style={{
        boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
      }}
      className="bg-black  rounded-[10px] z-50 w-full absolute min-h-[100px] max-h-[300px] h-auto overflow-auto my-2 "
    >
      <p className="text-center py-3 gray">
        Try searching for people, lists, or keywords
      </p>
    </div>
  );
};

export default ShowSearchPreview;
