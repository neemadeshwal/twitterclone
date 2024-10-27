import React from "react";
import { BsTwitterX } from "react-icons/bs";
import SignupGoogle from "../signup/signupGoogle";
import SignupFacebook from "../signup/signupFacebook";
import DivisionBar from "@/shared/divisionbar";
import CreateAccount from "../signup/createAccount";
import Link from "next/link";
import SigninAccountbtn from "./signinbtn";

const Login = () => {
  return (
    <div>
      {" "}
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
                  Sign in to catchup
                </h3>
                <div className="">
                  <div className="flex flex-col gap-2 py-4 pb-1">
                    <SignupGoogle signupType="login" />
                    <SignupFacebook signupType="login" />
                  </div>
                  <div className="flex gap-1 pb-1  w-full h-full items-center">
                    <DivisionBar type="x" />
                    or
                    <DivisionBar type="x" />
                  </div>
                  <div>
                    <SigninAccountbtn authType="login" />
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
                      Don't have a account?
                    </h3>

                    <div className="">
                      <Link href="/signup">
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
    </div>
  );
};

export default Login;
