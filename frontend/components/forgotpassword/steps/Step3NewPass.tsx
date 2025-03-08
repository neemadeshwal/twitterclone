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
import { userUserMutation } from "@/hooks/mutation/useUserMutation";
import { toast } from "sonner";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter.",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "Password must contain at least one lowercase letter.",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "Password must contain at least one number.",
      })
      .refine((password) => /[^A-Za-z0-9]/.test(password), {
        message: "Password must contain at least one special character.",
      }),
    confirmpassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
  });
const Step3Password = ({
  data,
  setGetData,
}: {
  data: { next_page: string; email: string };
  setGetData: React.Dispatch<
    React.SetStateAction<{
      next_page: string;
      email: string;
    }>
  >;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmpassword: "",
    },
  });
  const [showpassword, setShowPassword] = useState(false);
  const [showconfirmpassword, setshowconfirmpassword] = useState(false);
  const [isPasswordSame, setIsPasswordSame] = useState(true);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [typedPassword, setTypedPassword] = useState("");
  const [typedConfirmPassword, setTypedConfirmPassword] = useState("");

  const { newPassFn } = userUserMutation({
    onError: (error) => {
      if (error.message.includes("badRequestError")) {
        setIsPasswordSame(true);
      } else {
        toast.error(error.message);
      }
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    if (values.password !== values.confirmpassword) {
      return;
    }
    const body = {
      password: values.password,
      email: data.email,
    };
    try {
      const result = await newPassFn(body);
      if (result && result.resetPassword) {
        setGetData({
          next_page: result.resetPassword.next_page,
          email: result.resetPassword.email,
        });
        toast.success("Password reset Successful");
        if (result.resetPassword.next_page === "signin") {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (typedConfirmPassword == "" || typedPassword == "") {
      return;
    }
    if (typedConfirmPassword !== typedPassword) {
      setIsPasswordSame(false);
    } else {
      setIsPasswordSame(true);
    }
  }, [typedConfirmPassword, typedPassword]);
  return (
    <div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="createaccount">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <div>
                      <FormItem className="relative pt-[1rem] pb-1 border-gray-600  px-1 border rounded-[5px]  focus-within:border-[#1d9bf0]  focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] ">
                        <FormControl>
                          <Input
                            id="password"
                            autoFocus
                            type={showpassword ? "text" : "password"}
                            className="block w-full px-4 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                            placeholder=""
                            {...field}
                          />
                        </FormControl>

                        <label
                          htmlFor="password"
                          className={`absolute text-[16px] ${
                            form.getValues("password")
                              ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                              : "left-4 top-2 -translate-y-4"
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
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmpassword"
                  render={({ field }) => (
                    <div>
                      <FormItem
                        className={`relative pt-[1rem] pb-1 
                     ${
                       !isPasswordSame
                         ? "border-red-500 focus-within:border-red-500"
                         : "border-gray-600 focus-within:border-[#1d9bf0] "
                     }     px-1 border rounded-[5px]   focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] `}
                      >
                        <FormControl>
                          <Input
                            id="confirmpassword"
                            type={showconfirmpassword ? "text" : "password"}
                            className="block w-full px-4 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                            placeholder=""
                            {...field}
                          />
                        </FormControl>

                        <label
                          htmlFor="confirmpassword"
                          className={`absolute text-[16px]  ${
                            !isPasswordSame
                              ? "text-red-500 peer-focus:text-red-500"
                              : " text-gray-500 peer-focus:text-[#1d9bf0]"
                          }  ${
                            form.getValues("confirmpassword")
                              ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                              : "left-4 top-2 -translate-y-4"
                          } left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] `}
                        >
                          Confirm password
                        </label>
                        <p
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setshowconfirmpassword((prevVal) => !prevVal);
                          }}
                          className="absolute cursor-pointer top-[22%] right-4 hidden peer-focus:inline text-gray-500"
                        >
                          {showconfirmpassword ? (
                            <FaRegEyeSlash />
                          ) : (
                            <FaRegEye />
                          )}
                        </p>
                      </FormItem>
                      <FormMessage />
                    </div>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Step3Password;
