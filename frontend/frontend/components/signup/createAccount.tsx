"use client";
import React, { useState } from "react";
import { BsTwitterX, BsX } from "react-icons/bs";
import Step1Creds from "./steps/step1-creds";

const CreateAccount = ({ authType }: { authType: "login" | "signup" }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div>
      <div>
        <div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="text-white hover:bg-[#1c8bd5] rounded-full py-2 w-full x-bgcolor font-[600]"
          >
            {authType === "login" ? "Sign in to account" : "Create account"}
          </button>
        </div>
      </div>
      {isCreateOpen && (
        <div className="z-50">
          <div className="w-screen h-screen fixed top-0 left-0 z-50 dimBg flex items-center justify-center ">
            <div className="bg-black w-[45%] h-[90%]  rounded-[20px] ">
              <div className="p-4">
                <div className="w-full relative flex justify-center items-center">
                  <div className="absolute top-0 left-0">
                    <BsX className="text-[30px]" />
                  </div>

                  <BsTwitterX className="text-[30px]" />
                </div>
              </div>
              <div className="flex  flex-col w-full h-full">
                <div className="p-4 px-20 h-[70%] overflow-auto ">
                  <div>
                    <div>
                      <h4 className="font-[700] text-[31px] leading-[36px]">
                        Create your account
                      </h4>
                    </div>
                    <div className="py-[20px]">
                      <Step1Creds />
                    </div>
                  </div>
                </div>
                <div
                  style={{ boxShadow: "0 -0.4px 0px rgba(255,255,255,0.5)" }}
                  className="p-4 px-20 items-center flex justify-center pt-6"
                >
                  <button className="bg-white  text-black items-center w-full py-[0.8rem] font-[700] rounded-full">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAccount;
