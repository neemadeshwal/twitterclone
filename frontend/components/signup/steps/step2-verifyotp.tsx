import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userUserMutation } from "@/hooks/mutation/useUserMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getDataProps } from "../createAccount";

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "please enter valid otp",
  }), // First, we treat it as a string.
});

const Step2VerifyOtp = ({
  data,
  setGetData,
  authType,
}: {
  data: getDataProps;
  setGetData: React.Dispatch<React.SetStateAction<getDataProps>>;
  authType: string;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { verifyOtpFn } = userUserMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const body = {
      otp: values.otp.toString(),
      email: data.email,
      authType: authType,
    };
    try {
      const result = await verifyOtpFn(body);
      if (result && result.verifyOtp) {
        setGetData((prevVal) => ({
          ...prevVal,
          next_page: result.verifyOtp.next_page,
          email: result.verifyOtp.email,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <div>
        <div></div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="verifyotp">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="relative pt-[1rem] pb-1 border-gray-600  px-1 border rounded-[5px]  focus-within:border-[#1d9bf0]  focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] ">
                  <FormControl>
                    <Input
                      id="verifyotp"
                      autoFocus
                      className="block w-full px-4 pl-2 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                      placeholder=""
                      {...field}
                    />
                  </FormControl>

                  <label
                    htmlFor="verifyotp"
                    className={`absolute text-[16px] ${
                      form.getValues("otp")
                        ? "text-[11px] top-8 -translate-y-9 text-gray-500"
                        : "left-4 top-2 -translate-y-4"
                    } left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9 peer-focus:text-[#1d9bf0] `}
                  >
                    Verification code
                  </label>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div>
          <p className=" text-[12px] pl-1 leading-[24px] text-[#1d9bf0] ">
            Didn&apos;t receive the email?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step2VerifyOtp;
