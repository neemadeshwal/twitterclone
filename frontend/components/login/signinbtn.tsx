"use client";
import React, { useState } from "react";
import { BsTwitterX, BsX } from "react-icons/bs";
import Step1CheckEmail from "./steps/step1CheckEmail";
import Step2VerifyPass from "./steps/step2VerifyPass";

const SigninAccountbtn = ({ authType }: { authType: "login" | "signup" }) => {
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
                  <div
                    className="absolute top-0 left-0"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    <BsX className="text-[40px] cursor-pointer p-2 hover:bg-[#171717d5] rounded-full" />
                  </div>

                  <BsTwitterX className="text-[30px]" />
                </div>
              </div>
              <div className="flex  flex-col w-full h-full">
                <div className="p-4 px-28 h-[70%] overflow-auto ">
                  <div>
                    <div>
                      <h4 className="font-[700] text-[31px] leading-[36px]">
                        {/* Create your account */}
                        {/* We sent you a code */}
                        {/* Sign in to X */}
                        Enter your password
                      </h4>
                      {/* <p className="text-gray-400 text-[13px] mt-1">
                        Enter it below to verify your email.
                      </p> */}
                    </div>
                    <div className="py-[24px]">{<Step2VerifyPass />}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SigninAccountbtn;
