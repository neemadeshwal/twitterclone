"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { days, months, years } from "@/lib/functions";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const formSchema = z.object({
  password: z
    .string()
    .min(2, { message: "firstname should be atleast 2 characters." })
    .max(50),
});

const Step2VerifyPass = () => {
  const [showpassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col h-[37vh]  gap-6">
                <div className="rounded-[5px] bg-[#161616c1] p-2 text-[#444444c1] font-[300]">
                  <p className="text-[13px]">Email</p>
                  <p>neema@gmail.com</p>
                </div>
                <div>
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
                          className="absolute text-[16px] left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] "
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
                  <div>
                    <p className=" text-[12px] pl-2 leading-[24px] text-[#1d9bf0] ">
                      Forgot password?
                    </p>
                  </div>
                </div>
              </div>
              <div className=" items-center flex justify-center  w-full">
                <button className="bg-white  text-black items-center w-full py-[0.8rem] font-[700] rounded-full">
                  Log in
                </button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Step2VerifyPass;
