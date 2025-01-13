import { confirmYou, getCredAndSendOtp } from '@/graphql/mutation/user';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link'
import React from 'react'
import { BsTwitterX, BsX } from 'react-icons/bs'
import { FaCircleCheck } from 'react-icons/fa6';

const Step2ConfirmYou = ({authEmail,setAuthData}:any) => {

    const hideEmailConst=authEmail.split("@")[0].slice(2);

    const mutation = useMutation({
      mutationFn: confirmYou,
      onSuccess: (newData: any) => {
        console.log(newData);
        const result = newData.confirmedMail;
        setAuthData({
          next_page: result.next_page,
          email: result.email,
        });
      },
    });
   async function handleSubmit(event:any){
      event.preventDefault(); 
      console.log("handelsubmit")

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
    <form  id="confirmyou"  onSubmit={handleSubmit}>
    <div  className='flex flex-col gap-6 justify-between h-full'>
      
      <div className='flex justify-between items-center'>

       <div className='flex font-[700]'>
        <p className='flex'>
        Send an email to {authEmail.slice(0,2)} <span className='flex'>{hideEmailConst.split("").map((char:CharacterData,index:string)=><span key={char+index}>*</span>)}</span>
        </p>
        <p className='flex'>@{authEmail.split("@")[1].slice(0,1)} <span className='flex'> {authEmail.split("@")[1].slice(1).split("").map((char:CharacterData,index:string)=><span key={char+index}>*</span>)}</span></p>
        <p>

        </p>
       </div>
       <div>
       <FaCircleCheck className='x-textcolor' />
       </div>
      </div>
      <div>
        <p>
        Contact <span className='x-textcolor'>X Support</span> if you don’t have access.
        </p>
      </div>
      {/* <div className='flex flex-col gap-6'>
      <div className=" items-center flex justify-center  w-full">
                 

                </div>
                <div className=" items-center flex justify-center  w-full">
                  <button
                    type="submit"
                  className="text-white  bg-black items-center w-full py-[0.6rem] font-[700] rounded-full border border-gray-500">

                  
                    cancel
                  </button>

                </div>
                
                
      </div> */}
    </div>
    </form>
  )
}

export default Step2ConfirmYou