import React from "react";
import Photos from "./Photos";
import PostDetail from "./PostDetail";

const PostPhotos = () => {
  return (
    <div className="bg-black/80">
      <div>
        <div className="w-full">
          <Photos />
          <PostDetail />
        </div>
      </div>
    </div>
  );
};

export default PostPhotos;
