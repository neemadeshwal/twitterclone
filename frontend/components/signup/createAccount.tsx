"use client";
import React, { useState } from "react";
import { BsTwitterX, BsX } from "react-icons/bs";
import Step1Creds from "./steps/step1-creds";
import Step2VerifyOtp from "./steps/step2-verifyotp";
import Step3Password from "./steps/step3-password";
import ScrollLock from "@/shared/ScrollLock";
import Loading from "@/shared/loading";

export interface getDataProps {
  next_page: string;
  email: string;
}
const CreateAccount = ({ authType }: { authType: "login" | "signup" }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);
  const [isgettingCredSuccess, setIsGettingCredSuccess] = useState(false);
  const [isverifyingOtpSuccess, setIsVerifyingOtpSuccess] = useState(false);
  const [isNewPassSuccess, setIsNewPassSuccess] = useState(false);
  const [getData, setGetData] = useState<getDataProps>({
    next_page: "getcred",
    email: "",
  });

  function handleSubmitForm() {
    const form =
      document.getElementById("getcreds") ||
      document.getElementById("verifyotp") ||
      (document.getElementById("createaccount") as HTMLFormElement);

    if (form) {
      const event = new Event("submit", { cancelable: true, bubbles: true });
      form.dispatchEvent(event);
    }
  }

  return (
    <div>
      <ScrollLock isOpen={true} />
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
            <div className="bg-black w-full  md:w-[600px]   h-full md:h-[95%]  rounded-none md:rounded-[20px] ">
              <div className="md:p-4 px-1 py-2">
                <div className="w-full relative flex justify-center items-center">
                  <div
                    className="absolute top-0 left-0"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    <BsX
                      style={{ strokeWidth: "0.01px" }}
                      className=" text-[30px] md:text-[50px] cursor-pointer md:stroke-2 stroke-0 p-0 md:p-2 hover:bg-[#171717d5] rounded-full"
                    />
                  </div>

                  <BsTwitterX className="text-[30px]" />
                </div>
              </div>
              <div className="flex  flex-col w-full h-full">
                <div className="p-4 px-8 sm:px-[10vw] md:px-20 h-[75%] py-10 overflow-auto ">
                  <div>
                    <div>
                      <h4 className="font-[700] text-[31px] leading-[36px]">
                        {getData.next_page === "getcred"
                          ? "Create your account"
                          : getData.next_page === "verifyotp"
                          ? " We sent you a code"
                          : getData.next_page === "password"
                          ? "Create password"
                          : ""}
                      </h4>
                      {getData.next_page === "verifyotp" ? (
                        <p className="text-gray-400 text-[13px] mt-1">
                          Enter it below to verify your email.
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="py-[24px]">
                      {getData.next_page === "getcred" ? (
                        <Step1Creds
                          setGetData={setGetData}
                          setIsFormValid={setIsFormValid}
                          setIsGettingCredSuccess={setIsGettingCredSuccess}
                        />
                      ) : getData.next_page === "verifyotp" ? (
                        <Step2VerifyOtp
                          authType="createaccount"
                          setGetData={setGetData}
                          data={getData}
                          setIsFormValid={setIsFormValid}
                          setIsVerifyingOtpSuccess={setIsVerifyingOtpSuccess}
                        />
                      ) : getData.next_page === "password" ? (
                        <Step3Password
                          data={getData}
                          setGetData={setGetData}
                          setIsNewPassSuccess={setIsNewPassSuccess}
                          setIsFormValid={setIsFormValid}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
                <div
                  style={{ boxShadow: "0 -0.4px 0px rgba(255,255,255,0.5)" }}
                  className="p-4 px-14 md:px-20 items-center flex justify-center pt-6"
                >
                  <button
                    disabled={!isFormValid}
                    onClick={handleSubmitForm}
                    className="bg-white disabled:bg-white/50  text-black items-center w-full py-[0.8rem] font-[700] rounded-full"
                  >
                    {isgettingCredSuccess ||
                    isNewPassSuccess ||
                    isverifyingOtpSuccess ? (
                      <div className="flex justify-center">
                        <Loading small={true} />
                      </div>
                    ) : (
                      " Next"
                    )}
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
