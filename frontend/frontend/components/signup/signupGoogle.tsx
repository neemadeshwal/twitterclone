import React from "react";
import { FcGoogle } from "react-icons/fc";

const SignupGoogle = ({ signupType }: { signupType: "login" | "signup" }) => {
  return (
    <div>
      <div>
        <button className="bg-white hover:bg-[#ffffffed] text-black py-2 w-full items-center rounded-full flex justify-center gap-2 ">
          <FcGoogle className="text-[25px]" />
          <h6 className="text-[15px] font-[500] text-[#111111]">
            Sign {signupType === "login" ? "in" : "up"} with Google
          </h6>
        </button>
      </div>
    </div>
  );
};

export default SignupGoogle;
