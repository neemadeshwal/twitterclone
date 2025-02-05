"use client";
import MoreContainer from "@/shared/moreContainer";
import { Icons } from "@/utils/icons";
import React, { useState } from "react";

const MoreContainerTrigger = () => {
  const [moreContainer, setMoreContainer] = useState(false);

  return (
    <div>
      <div
        onClick={() => setMoreContainer(true)}
        className="p-2 more-bottom-height mt-2 rounded-full fullWidth w-fit hover:bg-[#1d1d1dbb] flex items-center justify-center cursor-pointer fixPosition px-width"
      >
        <Icons.CircleDots className="text-[28px]" />
        <span className="hidden showIcon capitalize">more</span>
      </div>
      {moreContainer && <MoreContainer setMoreContainer={setMoreContainer} />}
    </div>
  );
};

export default MoreContainerTrigger;
