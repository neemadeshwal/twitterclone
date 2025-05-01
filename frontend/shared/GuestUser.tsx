"use client"
import { toast } from '@/hooks/use-toast';
import React, { useCallback, useState } from 'react'
import { IoCopyOutline } from "react-icons/io5";
import {  IoMdCheckmark } from "react-icons/io";
const GUESTUSER={
    email:"guestuser@gmail.com",
    password:"Guestuser@123",
}
const GuestUser = ({widthFull}:{widthFull?:boolean}) => {

  
    const[isEmailCopied,setIsEmailCopied]=useState(false)
    const[isPasswordCopied,setIsPasswordCopied]=useState(false)
    const handleCopyLink = useCallback((text:string) => {
      
          if (navigator.clipboard) {
            navigator.clipboard
              .writeText(text)
              .then(() => {
                if(text===GUESTUSER.email){
                    setIsEmailCopied(true)
               
                    setTimeout(() => setIsEmailCopied(false), 1000);
                }
                if(text===GUESTUSER.password){
                    setIsPasswordCopied(true)
                    setTimeout(() => setIsPasswordCopied(false), 1000);

                }


              })
              .catch((error) => {
                console.log(error, "failed to copy ");
                toast({
                  variant: "destructive",
                  description: "Failed to copy to clipboard",
                });
              });
          } else {
            // Fallback for older browsers
            try {
              const textArea = document.createElement("textarea");
              textArea.value =text;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand("copy");
              document.body.removeChild(textArea);

            if(text===GUESTUSER.email){
                    setIsEmailCopied(true)
              setTimeout(() => setIsEmailCopied(false), 1000);

            }
            if(text===GUESTUSER.password){
                setIsPasswordCopied(true)
                setTimeout(() => setIsPasswordCopied(false), 1000);
            }
            } catch (error) {
              toast({
                variant: "destructive",
                description: "Failed to copy to clipboard",
              });
            }
          }
        }, [GUESTUSER.email,GUESTUSER.password]);
  return (
    <div className={`rounded-[13px] p-2 border border-gray-700 ${widthFull?"w-full":"w-fit"}`}>
                 <p className="text-[12px] md:text-[14px] gray">For Guest User</p> 
                 <div className={`flex gap-2  items-center mt-2 ${widthFull?"w-full":"w-[230px] "} relative `} onClick={()=>handleCopyLink(GUESTUSER.email)}>
                 <p  className="text-[13px] md:text-[14px] text-blue-400 font-[500]"><span className="gray">Email: </span>{GUESTUSER.email}</p>
                <div className='p-1 rounded-[7px] absolute right-0 cursor-pointer hover:bg-[#2b2b2b8e]'>
                {
                    !isEmailCopied?
                    <IoCopyOutline className='gray'/>
                    :
                    <IoMdCheckmark className='gray'/>


                }

                </div>
                    </div> 
                    <div className={`flex gap-2 mt-2 items-center relative ${widthFull?"w-full":"w-[230px] "}`} onClick={()=>handleCopyLink(GUESTUSER.password)}>
                    <p className="text-[13px] md:text-[14px] text-blue-400 font-[500]"><span className="gray">Password: </span>{GUESTUSER.password} </p>
                    <div className='p-1  absolute right-0 rounded-[7px] cursor-pointer hover:bg-[#2b2b2b8e]'>
                        {
                            !isPasswordCopied?
                            <IoCopyOutline className='gray'/>:
                            <IoMdCheckmark className='gray'/>
                        }
                    </div>
                    </div>

                </div>
  )
}

export default GuestUser