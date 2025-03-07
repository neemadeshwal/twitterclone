"use client";
import {
  Form,
  FormControl,
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
import { getDataProps } from "../createAccount";
import { userUserMutation } from "@/hooks/mutation/useUserMutation";
import Loading from "@/shared/loading";

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
    year: z.string()
  .min(1, { message: "Year is required" })
  .transform(val => Number(val))
  .refine(n => !isNaN(n), { message: "Year must be a valid number" })
  .refine(n => n >= 1900, { message: "Year should be a valid year" }),

day: z.string()
  .min(1, { message: "Day is required" })
  .transform(val => Number(val))
  .refine(n => !isNaN(n), { message: "Day must be a valid number" })
  .refine(n => n >= 1, { message: "Day should be a positive number" })
})})

const Step1Creds = ({
  setGetData,
}: {
  setGetData: React.Dispatch<React.SetStateAction<getDataProps>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const { getCredAndSendOtpFn, isgettingCred } = userUserMutation({
    onSuccess: () => {
      console.log("Credentials submitted successfully");
    },
    onError: (error) => {
      console.error("Error submitting credentials:", error);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const monthIndex = months.indexOf(values.dob.month) + 1;
    const newData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      dateOfBirth: `${monthIndex}/${values.dob.day}/${values.dob.year}`,
    };

    try {
      const result = await getCredAndSendOtpFn(newData);
      if (result && result.getCredAndSendOtp) {
        setGetData((prevVal) => ({
          ...prevVal,
          next_page: result.getCredAndSendOtp.next_page,
          email: result.getCredAndSendOtp.email,
        }));
      }
      else{

        console.log(result,"result")



      }
    } catch (error) {
      console.log(error.ClientError,"an erro");
      if (error.message?.includes("User already exists") || 
        error.graphQLErrors?.some((e: any) => e.message?.includes("User already exists"))) {
    }
  }

 if(isgettingCred){
  return <div className="flex justify-center py-4"><Loading/></div>
 }

  return (
    <div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="getcreds">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <div>
                      <FormItem className="relative pt-[1rem] pb-1 border-gray-600  px-1 border rounded-[5px]  focus-within:border-[#1d9bf0]  focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] ">
                        <FormControl>
                          <Input
                            id="firstName"
                            autoFocus
                            className="block w-full px-4 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                            placeholder=""
                            {...field}
                          />
                        </FormControl>

                        <label
                          htmlFor="firstName"
                          className={`absolute text-[16px] ${
                            form.getValues("firstName")
                              ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                              : "left-4 top-2 -translate-y-4"
                          } left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] `}
                        >
                          First name
                        </label>

                        <p className="absolute -top-1 right-2 hidden peer-focus:inline text-gray-500">
                          {form.getValues("firstName").length}/50
                        </p>
                      </FormItem>
                      <FormMessage />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="relative pt-[1rem] pb-1 border-gray-600  px-1 border rounded-[5px]  focus-within:border-[#1d9bf0]  focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] ">
                      <FormControl>
                        <Input
                          id="lastName"
                          className="block w-full px-4 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                          placeholder=""
                          {...field}
                        />
                      </FormControl>

                      <label
                        htmlFor="lastName"
                        className={`absolute text-[16px] ${
                          form.getValues("lastName")
                            ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                            : "left-4 top-2 -translate-y-4"
                        } left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] `}
                      >
                        last name
                      </label>

                      <p className="absolute -top-1 right-2 hidden peer-focus:inline text-gray-500">
                        {form.getValues("lastName").length}/50
                      </p>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <div>
                      <FormItem className="relative pt-[1rem] pb-1 border-gray-600  px-1 border rounded-[5px]  focus-within:border-[#1d9bf0]  focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] ">
                        <FormControl>
                          <Input
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
                          email
                        </label>
                      </FormItem>
                      <FormMessage />
                    </div>
                  )}
                />
              </div>
              <div>
                <div>
                  <h2 className="font-[600] text-[17px]">Date of birth</h2>
                  <p className="text-gray-500 text-[13px] mt-1">
                    This will not be shown publicly. Confirm your own age, even
                    if this account is for a business, a pet, or something else.
                  </p>
                </div>
                <div className="flex gap-2 items-center py-4">
                  <FormField
                    control={form.control}
                    name="dob.month"
                    render={({ field }) => (
                      <FormItem className="focus-within:border-[#1d9bf0]  w-[45%]">
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className=" border-gray-600 focus:border-[#1d9bf0] focus:ring-[#1d9bf0]  rounded-[5px] py-7 relative">
                              <FormLabel className="absolute top-1 text-gray-400 font-[300] peer-focus:text-[#1d9bf0] focus:text-[#1d9bf0] left-3 text-[14px] ">
                                Month
                              </FormLabel>
                              <div className="pt-5 text-[17px]">
                                <SelectValue className="" placeholder="" />
                              </div>
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {months.map((item, index) => {
                              return (
                                <SelectItem value={item} key={item + index}>
                                  {item}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob.day"
                    render={({ field }) => (
                      <FormItem className="focus-within:border-[#1d9bf0]  w-[23%]">
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className=" border-gray-600 focus:border-[#1d9bf0] focus:ring-[#1d9bf0]  rounded-[5px] py-7 relative">
                              <FormLabel className="absolute top-1 font-[300] text-gray-400 peer-focus:text-[#1d9bf0] focus:text-[#1d9bf0] left-3 text-[14px] ">
                                Day
                              </FormLabel>
                              <div className="pt-5 text-[17px]">
                                <SelectValue className="" placeholder="" />
                              </div>
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {days.map((item, index) => {
                              return (
                                <SelectItem
                                  value={item.toString()}
                                  key={item + index}
                                >
                                  {item}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dob.year"
                    render={({ field }) => (
                      <FormItem className="focus-within:border-[#1d9bf0]  w-[32%]">
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className=" border-gray-600 focus:border-[#1d9bf0] focus:ring-[#1d9bf0]  rounded-[5px] py-7 relative">
                              <FormLabel className="absolute top-1 text-gray-400 font-[300] peer-focus:text-[#1d9bf0] focus:text-[#1d9bf0] left-3 text-[14px] ">
                                Year
                              </FormLabel>
                              <div className="pt-5 text-[17px]">
                                <SelectValue className="" placeholder="" />
                              </div>
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {years.map((item, index) => {
                              return (
                                <SelectItem
                                  value={item.toString()}
                                  key={item + index + item + "year"}
                                >
                                  {item}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Step1Creds;
