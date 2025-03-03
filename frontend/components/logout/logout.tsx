"use client";
import { BsTwitterX } from "react-icons/bs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactDom from "react-dom";

const Logout = ({
  isDialogOpen,
  setisDialogOpen,
}: {
  isDialogOpen: boolean;
  setisDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  async function handleLogout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    router.push("/login");
  }
  const element = (
    <div className="z-[1000]">
      <div className="z-[100000]">
        <div className="w-screen h-screen fixed top-0 left-0 z-50 dimBg flex items-center justify-center ">
          <div className="bg-black w-full  md:w-[360px]   h-auto  rounded-none md:rounded-[20px] ">
            <div className="md:p-4 px-1 py-2">
              <div className="w-full relative flex justify-center items-center">
                <Link href="/login">
                  <div className="absolute top-0 left-0"></div>
                </Link>
                <BsTwitterX className="text-[30px]" />
              </div>
            </div>
            <div className="flex relative flex-col w-full py-4 h-[90%]">
              <div className="  px-8 sm:px-[10vw] md:px-10 h-4/5  overflow-auto ">
                <div>
                  <div>
                    <h4 className="font-[700] mb-2 text-[31px] leading-[36px]">
                      Log out of x?
                    </h4>
                    <p className="text-gray-400 text-[13px] mt-1">
                      You can always log back in at any time. If you just want
                      to switch accounts, you can do that by adding an existing
                      account.
                    </p>
                  </div>
                  <div className="py-[18px] h-full"></div>
                </div>
              </div>
              <div className="w-full">
                <div className="py-1 px-6 sm:px-20 md:px-10  items-center flex flex-col gap-6 pt-6">
                  <button
                    onClick={handleLogout}
                    className="bg-white  text-black items-center w-full py-[0.8rem] font-[700] rounded-full"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => setisDialogOpen(false)}
                    className="text-white border-gray-600 border-[1px]  bg-black items-center w-full py-[0.8rem] font-[700] rounded-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div>{isDialogOpen && ReactDom.createPortal(element, document.body)}</div>
  );
};

export default Logout;
