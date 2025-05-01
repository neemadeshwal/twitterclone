"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userUserMutation } from "@/hooks/mutation/useUserMutation";
import { toast } from "sonner";
import Loading from "@/shared/loading";
import GuestUser from "@/shared/GuestUser";

const formSchema = z.object({
  password: z
    .string()
    .min(5, { message: "password should be atleast 8 characters." })
    .max(50),
});

const Step2VerifyPass = ({
  setAuthData,
  authData,
  setIsCreateOpen,
}: {
  setAuthData: React.Dispatch<
    React.SetStateAction<{
      next_page: string;
      email: string;
    }>
  >;
  authData: {
    next_page: string;
    email: string;
  };
  setIsCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showpassword, setShowPassword] = useState(false);
  const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false);
  const [typedPassword, setTypedPassword] = useState("");
  const [previousPassword, setPreviousPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (!typedPassword || !previousPassword) return;

    if (typedPassword == previousPassword) {
      setIsPasswordIncorrect(true);
    } else {
      setIsPasswordIncorrect(false);
    }
  }, [typedPassword, previousPassword]);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const { verifyPassFn, isverifyingPassword } = userUserMutation({
    onError: (error) => {
      if (error.message.includes("Password is invalid")) {
        setIsPasswordIncorrect(true);
        setPreviousPassword(form.getValues("password"));
      } else {
        console.log(error);
        toast.error(error.message);
      }
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const body = {
      email: authData.email,
      password: values.password,
    };
    try {
      const result = await verifyPassFn(body);
      if (result && result.checkLoginPassword) {
        setAuthData({
          next_page: result.checkLoginPassword.next_page,
          email: result.checkLoginPassword.email,
        });
        if (result.checkLoginPassword.next_page === "signin") {
          setIsCreateOpen(false);
          console.log("taking to home page/.................");
          toast.success("Logged in successfully");
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Check if email is valid and account exists
      const isValid =
        value.password && value.password.length >= 5 && isPasswordIncorrect;

      setIsFormValid(isValid ? true : false);
    });

    return () => subscription.unsubscribe();
  }, [form, setIsFormValid, isPasswordIncorrect]);
  console.log(isFormValid);

  return (
    <div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col     gap-6">
                <div className="rounded-[5px] bg-[#161616c1] p-2 text-[#444444c1] font-[300]">
                  <p className="text-[13px]">Email</p>
                  <p>{authData.email}</p>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <div>
                        <FormItem
                          className={`relative pt-[1rem] ${
                            isPasswordIncorrect
                              ? "border-red-500 focus-within:border-red-500"
                              : "border-gray-600 focus-within:border-[#1d9bf0]"
                          } pb-1  px-1 border rounded-[5px]   focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] `}
                        >
                          <FormControl>
                            <Input
                              id="password"
                              autoFocus
                              type={showpassword ? "text" : "password"}
                              className="block w-full px-4 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                              placeholder=""
                              {...field}
                              onChange={(e) => {
                                field.onChange(e); // Call the form library's onChange
                                setTypedPassword(e.target.value); // Update your local state
                              }}
                            />
                          </FormControl>

                          <label
                            htmlFor="password"
                            className={`absolute text-[16px] 
                            ${
                              isPasswordIncorrect
                                ? "text-red-500 peer-focus:text-red-500"
                                : "text-gray-500 peer-focus:text-[#1d9bf0]"
                            }
                            ${
                              form.getValues("password")
                                ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                                : "left-4 top-5 -translate-y-4"
                            } left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] `}
                          >
                            Password
                          </label>

                          <p
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setShowPassword((prevVal) => !prevVal);
                            }}
                            className="absolute cursor-pointer top-[22%] right-4 hidden peer-focus:inline text-gray-500"
                          >
                            {showpassword ? <FaRegEyeSlash /> : <FaRegEye />}
                          </p>
                        </FormItem>
                        {isPasswordIncorrect && (
                          <p className="text-red-500 text-[14px]">
                            Incorrect password .Please try again
                          </p>
                        )}
                        <FormMessage />
                      </div>
                    )}
                  />
                  <Link href="/password_reset">
                    <div>
                      <p className=" text-[12px] pl-2 leading-[24px] text-[#1d9bf0] ">
                        Forgot password?
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
              <div className=" items-center flex justify-center  w-full">
                <button
                  // disabled={!isFormValid}
                  type="submit"
                  className="bg-white disabled:bg-white/50  text-black items-center w-full py-[0.8rem] font-[700] rounded-full"
                >
                  {isverifyingPassword ? (
                    <div className="flex items-center justify-center">
                      {" "}
                      <Loading small={true} />
                    </div>
                  ) : (
                    "Log in"
                  )}
                </button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div className="py-8">
            <GuestUser widthFull={true}/>
      
            </div>
    </div>
  );
};

export default Step2VerifyPass;
