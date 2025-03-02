"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { userUserMutation } from "@/hooks/mutation/useUserMutation";

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters long"),
});

const Step1CheckEmail = ({
  setAuthData,
  forgotpass,
}: {
  setAuthData: React.Dispatch<
    React.SetStateAction<{
      next_page: string;
      email: string;
    }>
  >;
  forgotpass: boolean;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { checkEmailFn } = userUserMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const body = {
      email: values.email,
      authType: forgotpass ? "confirmyou" : "login",
    };
    try {
      const result = await checkEmailFn(body);
      if (result && result.getLoginCreds) {
        setAuthData({
          next_page: result.getLoginCreds.next_page,
          email: result.getLoginCreds.email,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <div>
        <Form {...form}>
          <form id="checkemail" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative pt-[1rem] pb-1 border-gray-600  px-1 border rounded-[5px]  focus-within:border-[#1d9bf0]  focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] ">
                      <FormControl>
                        <Input
                          autoFocus
                          id="email"
                          className="block w-full px-4 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                          placeholder=""
                          {...field}
                        />
                      </FormControl>

                      <label
                        htmlFor="email"
                        className={`absolute text-[16px] ${
                          form.getValues("email")
                            ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                            : "left-4 top-5 -translate-y-4"
                        } left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] `}
                      >
                        email, or username
                      </label>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!forgotpass && (
                  <div className=" items-center flex justify-center  w-full">
                    <button
                      type="submit"
                      className="bg-white  text-black items-center w-full py-[0.6rem] font-[700] rounded-full"
                    >
                      Next
                    </button>
                  </div>
                )}

                {!forgotpass && (
                  <div className=" items-center flex justify-center  w-full">
                    <Link href="/password_reset" className="w-full ">
                      <button className="text-white  bg-black items-center w-full py-[0.6rem] font-[700] rounded-full border border-gray-500">
                        Forgot password ?
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Step1CheckEmail;
