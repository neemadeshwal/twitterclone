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
import React from "react";
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
import { useMutation } from "@tanstack/react-query";
import { getLoginCreds } from "@/graphql/mutation/user";

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters long"),
});

const Step1CheckEmail = ({ setAuthData }: any) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: getLoginCreds,
    onSuccess: (newData: any) => {
      console.log(newData);
      const result = newData.getLoginCreds;
      setAuthData({
        next_page: result.next_page,
        email: result.email,
      });
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const body = {
      email: values.email,
    };
    try {
      await mutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                            : "left-4 top-2 -translate-y-4"
                        } left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] `}
                      >
                        email, or username
                      </label>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className=" items-center flex justify-center  w-full">
                  <button
                    type="submit"
                    className="bg-white  text-black items-center w-full py-[0.6rem] font-[700] rounded-full"
                  >
                    Next
                  </button>
                </div>
                <div className=" items-center flex justify-center  w-full">
                  <button className="text-white  bg-black items-center w-full py-[0.6rem] font-[700] rounded-full border border-gray-500">
                    Forgot password ?
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Step1CheckEmail;
