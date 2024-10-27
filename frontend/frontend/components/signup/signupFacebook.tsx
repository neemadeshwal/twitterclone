import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const SignupFacebook = ({ signupType }: { signupType: "login" | "signup" }) => {
  return (
    <div>
      <div>
        <button className="bg-white hover:bg-[#ffffffed] text-black py-2 w-full items-center rounded-full flex justify-center gap-2 ">
          <FaFacebook className="text-[25px] text-[#1877F2]" />
          <h6 className="text-[15px] font-[600] text-[#111111]">
            Sign {signupType === "login" ? "in" : "up"} with facebook
          </h6>
        </button>
      </div>
    </div>
  );
};

export default SignupFacebook;
