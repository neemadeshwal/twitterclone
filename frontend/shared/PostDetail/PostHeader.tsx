import { Icons } from "@/utils/icons";
import { useRouter } from "next/navigation";
import React from "react";

const PostHeader = () => {
  const router = useRouter();
  return (
    <div>
      <div className="sticky top-0 z-50 backdrop-blur-sm py-1 px-4 bg-black/60">
        <div className="flex gap-9 items-center w-full">
          <div className="cursor-pointer" onClick={() => router.back()}>
            <Icons.ArrowLeft />
          </div>
          <div className="flex justify-between items-center w-full py-2">
            <h2 className="font-[600] text-[18px] capitalize">Post</h2>
            <button className="text-[14px] capitalize border border-white rounded-full px-4 py-1">
              reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
