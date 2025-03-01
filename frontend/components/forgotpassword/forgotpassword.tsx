"use client";
import React, { useState } from "react";
import { BsTwitterX, BsX } from "react-icons/bs";
import Step1CheckEmail from "../login/steps/step1CheckEmail";
import Link from "next/link";
import Step2ConfirmYou from "./steps/Step2ConfirmYou";
import Step3NewPass from "./steps/Step3NewPass";
import Step2VerifyOtp from "../signup/steps/step2-verifyotp";

const Forgotpassword = () => {
  const [authData, setAuthData] = useState({
    next_page: "checkemail",
    email: "",
  });

  function handleSubmitForm() {
    const form =
      document.getElementById("checkemail") ||
      document.getElementById("confirmyou") ||
      document.getElementById("verifyotp") ||
      (document.getElementById("createaccount") as HTMLFormElement);

    console.log(document.getElementById("confirmyou"));
    if (form) {
      const event = new Event("submit", { cancelable: true, bubbles: true });
      form.dispatchEvent(event);
    }
  }
  return (
    <div>
      <div className="z-50">
        <div className="w-screen h-screen fixed top-0 left-0 z-50 dimBg flex items-center justify-center ">
          <div className="bg-black w-full  md:w-[600px]   h-full md:h-[700px]  rounded-none md:rounded-[20px] ">
            <div className="md:p-4 px-1 py-2">
              <div className="w-full relative flex justify-center items-center">
                <Link href="/login">
                  <div className="absolute top-0 left-0">
                    <BsX
                      style={{ strokeWidth: "0.01px" }}
                      className=" text-[30px] md:text-[50px] cursor-pointer md:stroke-2 stroke-0 p-0 md:p-2 hover:bg-[#171717d5] rounded-full"
                    />
                  </div>
                </Link>
                <BsTwitterX className="text-[30px]" />
              </div>
            </div>
            <div className="flex relative flex-col w-full h-[90%]">
              <div className="  p-4 px-8 sm:px-[10vw] md:px-20 h-4/5 pt-10 overflow-auto ">
                <div>
                  <div>
                    <h4 className="font-[700] text-[31px] leading-[36px]">
                      {/* Create your account */}
                      {/* We sent you a code */}
                      {authData.next_page === "checkemail"
                        ? "Find your X account"
                        : authData.next_page === "confirmyou"
                        ? " Where should we send a confirmation code?"
                        : authData.next_page === "newpass"
                        ? "Choose a new password"
                        : authData.next_page === "verifyotp"
                        ? "We sent you a code"
                        : null}
                      {/* Sign in to X */}
                    </h4>
                    {authData.next_page == "checkemail" && (
                      <p className="text-gray-400 text-[13px] mt-1">
                        Enter the email or username associated with your account
                        to change your password.
                      </p>
                    )}
                    {authData.next_page == "verifyotp" && (
                      <p className="text-gray-400 text-[13px] mt-1">
                        Check your email to get your confirmation code. If you
                        need to request a new code, go back and reselect a
                        confirmation.
                      </p>
                    )}

                    {authData.next_page == "confirmyou" && (
                      <p className="text-gray-400 text-[13px] mt-1">
                        Before you can change your password, we need to make
                        sure it’s really you.
                        <br />
                        Start by choosing where to send a confirmation code.
                      </p>
                    )}
                    {authData.next_page == "newpass" && (
                      <p className="text-gray-400 text-[13px] mt-1">
                        Make sure your new password is 8 characters or more. Try
                        including numbers, letters, and punctuation marks for a
                        strong password.
                        <br />
                        You&apos;ll be logged out of all active X sessions after
                        your password is changed.
                      </p>
                    )}
                  </div>
                  <div className="py-[18px] h-full">
                    {authData.next_page === "checkemail" ? (
                      <Step1CheckEmail
                        forgotpass={true}
                        setAuthData={setAuthData}
                      />
                    ) : authData.next_page === "confirmyou" ? (
                      <Step2ConfirmYou
                        authEmail={authData.email}
                        setAuthData={setAuthData}
                      />
                    ) : authData.next_page === "verifyotp" ? (
                      <Step2VerifyOtp
                        setGetData={setAuthData}
                        authType="forgotpass"
                        data={authData}
                      />
                    ) : authData.next_page === "newpass" ? (
                      <Step3NewPass data={authData} setGetData={setAuthData} />
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 w-full h-1/5">
                <div className="py-1 px-6 sm:px-20  items-center flex justify-center pt-6">
                  <button
                    onClick={handleSubmitForm}
                    className="bg-white  text-black items-center w-full py-[0.8rem] font-[700] rounded-full"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgotpassword;
