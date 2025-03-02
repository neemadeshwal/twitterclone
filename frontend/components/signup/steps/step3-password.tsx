"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { getDataProps } from "../createAccount";
import { userUserMutation } from "@/hooks/mutation/useUserMutation";

const formSchema = z.object({
  password: z
    .string()
    .min(2, { message: "firstname should be atleast 2 characters." })
    .max(50),
  confirmpassword: z
    .string()
    .min(2, { message: "firstname should be atleast 2 characters." })
    .max(50),
});

const Step3Password = ({
  data,
  setGetData,
}: {
  data: getDataProps;
  setGetData: React.Dispatch<React.SetStateAction<getDataProps>>;
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

  const { createAccountFn } = userUserMutation();
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
      const result = await createAccountFn(body);
      if (result && result.createAccount) {
        setGetData((prevVal) => ({
          ...prevVal,
          next_page: result.createAccount.next_page,
          email: result.createAccount.email,
        }));
        if (result.createAccount.next_page === "signin") {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
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

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmpassword"
                  render={({ field }) => (
                    <FormItem className="relative pt-[1rem] pb-1 border-gray-600  px-1 border rounded-[5px]  focus-within:border-[#1d9bf0]  focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] ">
                      <FormControl>
                        <Input
                          id="confirmpass"
                          type={showconfirmpassword ? "text" : "password"}
                          className="block w-full px-4 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                          placeholder=""
                          {...field}
                        />
                      </FormControl>

                      <label
                        htmlFor="cofirmpass"
                        className={`absolute text-[16px] ${
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
                        {showconfirmpassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </p>

                      <FormMessage />
                    </FormItem>
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
