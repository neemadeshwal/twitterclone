import Image from "next/image";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

const PostDetail = () => {
  return (
    <div>
      <div>
        <div className="sticky top-0 z-50 backdrop-blur-sm py-1 px-4 bg-black/60">
          <div className="flex gap-9 items-center w-full">
            <div>
              <FaArrowLeft />
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <h2 className="font-[600] text-[18px] capitalize">Post</h2>
              <button className="text-[14px] capitalize border border-white rounded-full px-4 py-1">
                reply
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-2">
          <div className="bg-cyan-900 w-[40px] h-[40px]  rounded-full flex items-center justify-center text-[16px]">
            N
          </div>
          <div className="px-4">
            <h3 className="text-[16px] font-[600] leading-tight  capitalize">
              neema deshwal
            </h3>
            <p className="gray text-[14px] font-[400]">@deshwalneema</p>
          </div>
        </div>
        <div className="px-3 pr-5 py-2">
          <div>
            <div>
              Shri Devender Singh Rana Ji’s untimely demise is shocking. He was
              a veteran leader, who worked diligently towards Jammu and
              Kashmir’s progress. He had just won the Assembly polls and had
              also played a noteworthy role in making the BJP stronger in J&K.
              In this hour of grief, my thoughts are with his family and
              supporters. Om Shanti.
            </div>
          </div>
        </div>
        <div className="px-3">
          <Image
            src="/img.jpg"
            alt=""
            width="100"
            height="100"
            className="w-full rounded-[10px]"
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
