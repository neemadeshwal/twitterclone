import React from "react";
import { BiX } from "react-icons/bi";
import { BsTwitterX } from "react-icons/bs";
import SignupGoogle from "./signupGoogle";
import SignupFacebook from "./signupFacebook";
import CreateAccount from "./createAccount";
import DivisionBar from "@/shared/divisionbar";
import Link from "next/link";

const SignupComp = () => {
  return (
    <div className="p-[40px] sm:pl-[100px] md:pl-[140px] lg:p-[80px] lg:flex lg:justify-center ">
      <div className="flex  flex-col w-[70vw] sm:w-[50vw] md:w-[40vw] lg:flex-row lg:items-start lg:w-full lg:justify-between lg:max-w-[1000px]  ">
        <div className="flex  lg:justify-center lg:items-center lg:w-[40%]  my-auto lg:mb-[250px]  ">
          <BsTwitterX className="lg:text-[290px] text-[60px]" />
        </div>
        <div className="lg:w-[460px]">
          <div>
            <div className="py-[40px]">
              <h2 className="font-[700] tracking-[1px] text-[40px] sm:text-[64px] leading-[52px] sm:leading-[80px]">
                Happening now
              </h2>
            </div>
            <div className="lg:w-[70%]">
              <h3 className="font-[700] leading-[28px] text-[23px]">
                Join today.
              </h3>
              <div className="">
                <div className="flex flex-col gap-2 py-4 pb-1">
                  <SignupGoogle signupType="signup" />
                  <SignupFacebook signupType="signup" />
                </div>
                <div className="flex gap-1 pb-1  w-full h-full items-center">
                  <DivisionBar type="x" />
                  or
                  <DivisionBar type="x" />
                </div>
                <div>
                  <CreateAccount authType="signup" />
                </div>
              </div>
              <div className="py-2">
                <p className="font-[400] leading-[12px] text-[11px] text-[#71767b]">
                  By signing up, you agree to the Terms of Service and Privacy
                  Policy, including Cookie Use.
                </p>
              </div>
              <div className="py-8">
                <div className="flex flex-col gap-6">
                  <h3 className="text-[#e7e9ea] font-[700] text-[17px] leading-[20px]">
                    Already have an account?
                  </h3>

                  <div className="">
                    <Link href="/login">
                      <button className="border hover:text-blue-500 hover:bg-gray-950 border-px border-[#4949498e] rounded-full w-full py-2 text-center text-[#1d9bf0]">
                        Sign in
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupComp;
