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
import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
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
    year: z
      .string()
      .min(1, { message: "Year is required" })
      .transform((val) => Number(val))
      .refine((n) => !isNaN(n), { message: "Year must be a valid number" })
      .refine((n) => n >= 1900, { message: "Year should be a valid year" }),

    day: z
      .string()
      .min(1, { message: "Day is required" })
      .transform((val) => Number(val))
      .refine((n) => !isNaN(n), { message: "Day must be a valid number" })
      .refine((n) => n >= 1, { message: "Day should be a positive number" }),
  }),
});

const Step1Creds = ({
  setGetData,
  setIsFormValid,
  setIsGettingCredSuccess,
}: {
  setGetData: React.Dispatch<React.SetStateAction<getDataProps>>;
  setIsFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  setIsGettingCredSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const [isuserAlreadyExist, setIsUserAlreadyExist] = useState(false);
  const [previousEmail, setPreviousEmail] = useState("");
  const [typedEmail, setTypedEmail] = useState("");

  // Watch for email changes to reset the error state
  useEffect(() => {
    if (
      typedEmail === previousEmail &&
      (typedEmail !== "" || previousEmail !== "")
    ) {
      setIsUserAlreadyExist(true);
    } else {
      setIsUserAlreadyExist(false);
    }
  }, [typedEmail, previousEmail]);

  const { getCredAndSendOtpFn, isgettingCred } = userUserMutation({
    onSuccess: () => {
      console.log("Credentials submitted successfully");
    },
    onError: (error) => {
      if (error.message.includes("User already exists")) {
        setIsUserAlreadyExist(true);
        // Store the current email to compare against future changes
        setPreviousEmail(form.getValues("email"));
      } else {
        console.log("error");
        toast.error(error.message);
      }
      console.error("Error submitting credentials:", error);
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Remove this line to prevent overriding the API response
    // setIsUserAlreadyExist(true);

    const monthIndex = months.indexOf(values.dob.month) + 1;
    const newData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      dateOfBirth: `${monthIndex}/${values.dob.day}/${values.dob.year}`,
    };

    try {
      const result = await getCredAndSendOtpFn(newData);
      setIsGettingCredSuccess(false);

      if (result && result.getCredAndSendOtp) {
        setGetData((prevVal) => ({
          ...prevVal,
          next_page: result.getCredAndSendOtp.next_page,
          email: result.getCredAndSendOtp.email,
        }));
      } else {
        console.log(result, "result");
      }
    } catch (error) {
      console.log(error);
      setIsGettingCredSuccess(false);
    }
  }
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Check if email is valid and account exists
      const isValid =
        value.email &&
        value.firstName &&
        value.dob &&
        value.email.length >= 5 &&
        /\S+@\S+\.\S+/.test(value.email) &&
        isuserAlreadyExist;

      setIsFormValid(isValid ? true : false);
    });

    return () => subscription.unsubscribe();
  }, [form, setIsFormValid, isuserAlreadyExist]);

  useEffect(() => {
    setIsGettingCredSuccess(isgettingCred);
  }, [isgettingCred]);

  return (
    <div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="getcreds">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                {/* First Name Field */}
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
                            className="block w-full px-4  text-[16px] border-0 focus:outline-none  bg-transparent peer "
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
                {/* Last Name Field */}
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
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <div>
                      <FormItem
                        className={`relative pt-[1rem] pb-1 ${
                          isuserAlreadyExist
                            ? "border-red-500"
                            : "border-gray-600"
                        }   px-1 border rounded-[5px] ${
                          isuserAlreadyExist
                            ? "focus-within:border-red-500"
                            : "focus-within:border-[#1d9bf0] "
                        }   focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] `}
                      >
                        <FormControl>
                          <Input
                            {...field}
                            id="email"
                            className="block w-full px-4 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                            placeholder=""
                            onChange={(e) => {
                              field.onChange(e); // Call the form library's onChange
                              setTypedEmail(e.target.value); // Update your local state
                            }}
                          />
                        </FormControl>

                        <label
                          htmlFor="email"
                          className={`absolute text-[16px] ${
                            form.getValues("email")
                              ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                              : "left-4 top-2 -translate-y-4"
                          } left-4 top-2 ${
                            isuserAlreadyExist
                              ? "text-red-500"
                              : "text-gray-500"
                          } transition-all duration-200 capitalize peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 ${
                            isuserAlreadyExist
                              ? "peer-focus:text-red-500"
                              : "peer-focus:text-[#1d9bf0]"
                          } `}
                        >
                          email
                        </label>
                      </FormItem>
                      {isuserAlreadyExist && (
                        <p className="text-red-500 text-[14px]">
                          Email has already been taken.
                        </p>
                      )}
                      <FormMessage />
                    </div>
                  )}
                />
              </div>
              {/* Date of Birth Section */}
              <div>
                <div>
                  <h2 className="font-[600] text-[17px]">Date of birth</h2>
                  <p className="text-gray-500 text-[13px] mt-1">
                    This will not be shown publicly. Confirm your own age, even
                    if this account is for a business, a pet, or something else.
                  </p>
                </div>
                <div className="flex gap-2 items-center py-4">
                  {/* Month Selection */}
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
                  {/* Day Selection */}
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
                  {/* Year Selection */}
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
