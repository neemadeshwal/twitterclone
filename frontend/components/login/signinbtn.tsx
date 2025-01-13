"use client";
import React, { useState } from "react";
import { BsTwitterX, BsX } from "react-icons/bs";
import Step1CheckEmail from "./steps/step1CheckEmail";
import Step2VerifyPass from "./steps/step2VerifyPass";

const SigninAccountbtn = ({ authType }: { authType: "login" | "signup" }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [authData, setAuthData] = useState({
    next_page: "checkemail",
    email: "",
  });

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
            <div className="bg-black w-full  md:w-[600px]   h-full md:h-[700px]  rounded-none md:rounded-[20px] ">
              <div className="md:p-4 px-1 py-2">
                <div className="w-full relative flex justify-center items-center">
                  <div
                    className="absolute top-0 left-0"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    <BsX  style={{strokeWidth:"0.01px"}} className=" text-[30px] md:text-[50px] cursor-pointer md:stroke-2 stroke-0 p-0 md:p-2 hover:bg-[#171717d5] rounded-full" />
                  </div>

                  <BsTwitterX className="text-[30px]" />
                </div>
              </div>
              <div className="flex  flex-col w-full h-full">
                <div className="p-4 px-8 sm:px-[10vw] md:px-20 h-full py-10 overflow-auto ">
                  <div>
                    <div>
                      <h4 className="font-[700] text-[31px] leading-[36px]">
                        {/* Create your account */}
                        {/* We sent you a code */}
                        {authData.next_page === "checkemail"
                          ? "Sign in to X"
                          : authData.next_page === "verifypassword"
                          ? " Enter your password"
                          : ""}
                        {/* Sign in to X */}
                      </h4>
                      {/* <p className="text-gray-400 text-[13px] mt-1">
                        Enter it below to verify your email.
                      </p> */}
                    </div>
                    <div className="py-[24px]">
                      {authData.next_page === "checkemail" ? (
                        <Step1CheckEmail forgotpass={false} setAuthData={setAuthData} />
                      ) : authData.next_page === "verifypassword" ? (
                        <Step2VerifyPass
                          setAuthData={setAuthData}
                          authData={authData}
                          setIsCreateOpen={setIsCreateOpen}
                        />
                      ) : (
                        ""
                      )}
                      
                    </div>
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
