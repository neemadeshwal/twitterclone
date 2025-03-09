import { userUserMutation } from "@/hooks/mutation/useUserMutation";
import React, { useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";

const Step2ConfirmYou = ({
  authEmail,
  setAuthData,
  setIsConfirmMailSuccess,
}: {
  authEmail: string;
  setAuthData: React.Dispatch<
    React.SetStateAction<{
      next_page: string;
      email: string;
    }>
  >;
  setIsConfirmMailSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const hideEmailConst = authEmail.split("@")[0].slice(2);

  const { confirmMailFn, isConfirmMail } = userUserMutation();
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const body = {
      email: authEmail,
    };
    try {
      const result = await confirmMailFn(body);
      setIsConfirmMailSuccess(false);

      if (result && result.confirmedMail) {
        setAuthData({
          next_page: result.confirmedMail.next_page,
          email: result.confirmedMail.email,
        });
      }
    } catch (error) {
      console.log(error);
      setIsConfirmMailSuccess(false);
    }
  }
  useEffect(() => {
    if (isConfirmMail) {
      setIsConfirmMailSuccess(true);
    } else {
      setIsConfirmMailSuccess(false);
    }
  }, [isConfirmMail, setIsConfirmMailSuccess]);
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
            Contact <span className="x-textcolor">X Support</span> if you
            don&apos;t have access.
          </p>
        </div>
      </div>
    </form>
  );
};

export default Step2ConfirmYou;
