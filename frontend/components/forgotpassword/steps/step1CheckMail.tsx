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

import Link from "next/link";
import { userUserMutation } from "@/hooks/mutation/useUserMutation";
import Loading from "@/shared/loading";
import { toast } from "sonner";

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters long"),
});

const Step1CheckEmail = ({
  setAuthData,
}: {
  setAuthData: React.Dispatch<
    React.SetStateAction<{
      next_page: string;
      email: string;
    }>
  >;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const [isAccountExist, setAccountExist] = useState(true);
  const [previousEmail, setPreviousEmail] = useState("");
  const [typedEmail, setTypedEmail] = useState("");

  const { checkEmailFn } = userUserMutation({
    onError: (error) => {
      if (
        error.message.includes(
          "User does not exist. Please create an account first"
        )
      ) {
        console.log("exist error");
        setAccountExist(true);
        setPreviousEmail(form.getValues("email"));
      } else {
        console.log(error);
        toast.error(error.message);
      }
    },
  });

  useEffect(() => {
    if (!typedEmail || !previousEmail) return;

    if (typedEmail == previousEmail) {
      setAccountExist(false);
    } else {
      setAccountExist(true);
    }
  }, [typedEmail, previousEmail]);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const body = { email: values.email, authType: "confirmyou" };
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
                    <div>
                      <FormItem
                        className={`relative pt-[1rem] ${
                          !isAccountExist
                            ? "border-red-500 focus-within:border-red-500"
                            : "border-gray-600 focus-within:border-[#1d9bf0]"
                        } pb-1  px-1 border rounded-[5px]   focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] `}
                      >
                        <FormControl>
                          <Input
                            autoFocus
                            id="email"
                            className="block w-full px-4 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                            placeholder=""
                            {...field}
                            onChange={(e) => {
                              field.onChange(e); // Call the form library's onChange
                              setTypedEmail(e.target.value); // Update your local state
                            }}
                          />
                        </FormControl>

                        <label
                          htmlFor="email"
                          className={`absolute text-[16px] 
                          ${
                            !isAccountExist
                              ? "text-red-500 peer-focus:text-red-500"
                              : "text-gray-500 peer-focus:text-[#1d9bf0]"
                          }
                          ${
                            form.getValues("email")
                              ? "text-[11px] top-8 -translate-y-9 "
                              : "left-4 top-5 -translate-y-4"
                          } left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 `}
                        >
                          email, or username
                        </label>
                      </FormItem>
                      {!isAccountExist && (
                        <p className="text-red-500 text-[14px]">
                          Account does not exist .Please create account
                        </p>
                      )}
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

export default Step1CheckEmail;
