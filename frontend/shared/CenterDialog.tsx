import React from "react";

const CenterDialog = ({
  title,
  content,
  actionBtn,
  setCloseDialog,
}: {
  title: string;
  content: string;
  actionBtn: { name: string; action: any };
  setCloseDialog: any;
}) => {
  return (
    <div>
      <div className="z-[100000] flex justify-center items-center w-screen h-screen fixed dimBg gray top-0 left-0 p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="h-auto z-[10000] p-6 w-auto rounded-[15px] bg-black flex flex-col gap-4 max-w-[290px]"
        >
          <div className="flex flex-col gap-2 ">
            <h2 className="capitalize text-white text-[20px] font-[700]">
              {title}
            </h2>
            <p className="text-[14px]">{content}</p>
          </div>

          <div className="flex flex-col gap-3 capitalize font-[600] z-[100]">
            <button
              className="bg-[#f4212e] text-white rounded-[20px] capitalize py-2"
              onClick={() => actionBtn.action()}
            >
              {actionBtn.name}
            </button>
            <button
              className="text-white rounded-[20px] border-[1px] border-gray-500 py-2 capitalize"
              onClick={(event) => {
                event.stopPropagation();
                setCloseDialog(false);
              }}
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CenterDialog;
