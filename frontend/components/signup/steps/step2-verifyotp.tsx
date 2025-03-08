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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getDataProps } from "../createAccount";
import Loading from "@/shared/loading";
import { toast } from "sonner";
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

  const [invalidOtp, setInvalidOtp] = useState(false);
  const [previousOtp, setPreviousOtp] = useState("");
  const [typedOtp, setTypedOtp] = useState("");
  const [timer, setTimer] = useState(60); // Start with 1 minute (60 seconds)
  const [canResend, setCanResend] = useState(true);
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!canResend && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      setTimer((prev) => prev * 2); // Double the timer for the next resend
    }

    return () => clearInterval(interval);
  }, [canResend, timer]);
  useEffect(() => {
    if (previousOtp === typedOtp && (previousOtp !== "" || typedOtp !== "")) {
      setInvalidOtp(true);
    } else {
      setInvalidOtp(false);
    }
  }, [previousOtp, typedOtp]);
  const { verifyOtpFn, isverifyingOtp, resendCodeFn, isResendingCode } =
    userUserMutation({
      onError: (error) => {
        if (
          error.message.includes("Invalid OTP! Please enter the correct OTP.")
        ) {
          setInvalidOtp(true);
          setPreviousOtp(form.getValues("otp"));
        } else {
          toast.error(error.message);
        }
      },
    });

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

  async function handleResendCode(email: string) {
    if (!canResend) return;
    setCanResend(false);
    setTimer(60);
    try {
      const result = await resendCodeFn({ email });
      if (result && result.resendOtp) {
        toast.success(
          "A new OTP has been sent to your email. Please check your inbox and enter the code to proceed."
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (isverifyingOtp) {
    return (
      <div className="flex justify-center py-4">
        <Loading />
      </div>
    );
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
                <div>
                  <FormItem
                    className={` ${
                      invalidOtp
                        ? "border-red-500 focus-within:border-red-500"
                        : "border-gray-600 focus-within:border-[#1d9bf0]"
                    } relative pt-[1rem] pb-1  px-1 border rounded-[5px]    focus-within:shadow-[0 1px 8px rgba(29, 155, 240, 0.5)] `}
                  >
                    <FormControl>
                      <Input
                        id="otp"
                        autoFocus
                        className="block w-full px-4 pl-2 text-[16px] border-0 focus:outline-none  bg-transparent peer "
                        placeholder=""
                        {...field}
                        onChange={(e) => {
                          field.onChange(e); // Call the form library's onChange
                          setTypedOtp(e.target.value); // Update your local state
                        }}
                      />
                    </FormControl>

                    <label
                      htmlFor="otp"
                      className={`absolute text-[16px]
                      ${
                        invalidOtp
                          ? "text-red-500 peer-focus:text-red-500 "
                          : "text-gray-500 peer-focus:text-[#1d9bf0]"
                      }
                      ${
                        form.getValues("otp")
                          ? "text-[11px] top-8 -translate-y-9 "
                          : "left-4 top-2 -translate-y-4"
                      } left-4 top-2 transition-all duration-200 peer-focus:text-[13px] transform peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-4 peer-placeholder-shown:text-gray-500 peer-focus:top-8 peer-focus:-translate-y-9  `}
                    >
                      Verification code
                    </label>
                  </FormItem>
                  {invalidOtp && (
                    <p className="text-red-500 text-[14px]">
                      Otp is incorrect.
                    </p>
                  )}

                  <FormMessage />
                </div>
              )}
            />
          </form>
        </Form>
        {isResendingCode ? (
          <div className="mt-2">
            <Loading small={true} />
          </div>
        ) : (
          <div>
            <p
              onClick={() => handleResendCode(data.email)}
              className={` ${
                !canResend
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-[#1d9bf0]"
              } text-[12px] pl-1 leading-[24px]  `}
            >
              Resend email {timer > 0 && ` in ${timer} s`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step2VerifyOtp;
