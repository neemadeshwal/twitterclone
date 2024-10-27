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

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "firstname should be atleast 2 characters." })
    .max(50),
  lastName: z.string().max(50),
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters long"),
  dob: z.object({
    month: z.string().min(3, { message: "Month should not be empty" }),
    year: z.number().min(1, { message: "Year should be a positive number" }),
    day: z.number().min(1, { message: "Day should be a positive number" }),
  }),
});

const Step1CheckEmail = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
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
                        className="absolute text-[16px] left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] "
                      >
                        email, or username
                      </label>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className=" items-center flex justify-center  w-full">
                  <button className="bg-white  text-black items-center w-full py-[0.6rem] font-[700] rounded-full">
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
