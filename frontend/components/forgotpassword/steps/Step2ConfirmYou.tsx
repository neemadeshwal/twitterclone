import { confirmYou } from "@/graphql/mutation/user";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { FaCircleCheck } from "react-icons/fa6";

// Define the response type from your mutation
type ConfirmYouResponse = {
  confirmedMail: {
    email: string;
    next_page: string;
  };
};

// Define the request payload type
type ConfirmYouPayload = {
  email: string;
};

const Step2ConfirmYou = ({
  authEmail,
  setAuthData,
}: {
  authEmail: string;
  setAuthData: React.Dispatch<
    React.SetStateAction<{
      next_page: string;
      email: string;
    }>
  >;
}) => {
  const hideEmailConst = authEmail.split("@")[0].slice(2);

  const mutation = useMutation<ConfirmYouResponse, Error, ConfirmYouPayload>({
    mutationFn: confirmYou,
    onSuccess: (data) => {
      console.log(data);
      const result = data.confirmedMail;
      setAuthData({
        next_page: result.next_page,
        email: result.email,
      });
    },
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log("handelsubmit");

    const body = {
      email: authEmail,
    };
    try {
      await mutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form id="confirmyou" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6 justify-between h-full">
        <div className="flex justify-between items-center">
          <div className="flex font-[700]">
            <p className="flex">
              Send an email to {authEmail.slice(0, 2)}{" "}
              <span className="flex">
                {hideEmailConst.split("").map((char: string, index: number) => (
                  <span key={char + index}>*</span>
                ))}
              </span>
            </p>
            <p className="flex">
              @{authEmail.split("@")[1].slice(0, 1)}{" "}
              <span className="flex">
                {" "}
                {authEmail
                  .split("@")[1]
                  .slice(1)
                  .split("")
                  .map((char: string, index: number) => (
                    <span key={char + index}>*</span>
                  ))}
              </span>
            </p>
          </div>
          <div>
            <FaCircleCheck className="x-textcolor" />
          </div>
        </div>
        <div>
          <p>
            Contact <span className="x-textcolor">X Support</span> if you don't
            have access.
          </p>
        </div>
      </div>
    </form>
  );
};

export default Step2ConfirmYou;
