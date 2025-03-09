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
  const [isAccountExist, setAccountExist] = useState(true);
  const [previousEmail, setPreviousEmail] = useState("");
  const [typedEmail, setTypedEmail] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const { checkEmailFn, isCheckingEmail, confirmMailFn, isConfirmMail } =
    userUserMutation({
      onError: (error) => {
        if (error.message.includes("Account does not exist. not found")) {
          setAccountExist(false);
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
      setAccountExist(true);
    } else {
      setAccountExist(false);
    }
  }, [typedEmail, previousEmail]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (forgotpass) {
        const body = { email: values.email };
        const result = await confirmMailFn(body);
        if (result && result.confirmedMail) {
          setAuthData({
            next_page: result.confirmedMail.next_page,
            email: result.confirmedMail.email,
          });
        }
      } else {
        const body = {
          email: values.email,
          authType: forgotpass ? "confirmyou" : "login",
        };
        const result = await checkEmailFn(body);
        if (result && result.getLoginCreds) {
          setAuthData({
            next_page: result.getLoginCreds.next_page,
            email: result.getLoginCreds.email,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log(isFormValid);

  useEffect(() => {
    const subscription = form.watch((value) => {
      // Check if email is valid and account exists
      const isValid =
        value.email &&
        value.email.length >= 5 &&
        /\S+@\S+\.\S+/.test(value.email) &&
        isAccountExist;

      setIsFormValid(isValid ? true : false);
    });

    return () => subscription.unsubscribe();
  }, [form, setIsFormValid, isAccountExist]);

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
                {!forgotpass && (
                  <div className=" items-center flex justify-center  w-full">
                    <button
                      type="submit"
                      // disabled={!isFormValid}
                      className="bg-white disabled:bg-white/50  text-black items-center w-full py-[0.6rem] font-[700] rounded-full"
                    >
                      {isCheckingEmail || isConfirmMail ? (
                        <div className="flex items-center justify-center">
                          {" "}
                          <Loading small={true} />
                        </div>
                      ) : (
                        " Next"
                      )}
                    </button>
                  </div>
                )}

                {!forgotpass && (
                  <div className=" items-center flex justify-center  w-full">
                    <Link href="/password_reset" className="w-full ">
                      <button
                        type="button"
                        className="text-white  bg-black items-center w-full py-[0.6rem] font-[700] rounded-full border border-gray-500"
                      >
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
