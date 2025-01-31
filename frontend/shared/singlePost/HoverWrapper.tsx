"use client"
import React, {  useState } from 'react'
import HoverProfileDetail from '../HoverProfileDetail';

const HoverWrapper = ({userId,children}:{userId:string,children:React.ReactNode}) => {

    const[ishovered,setIsHovered]=useState<boolean>(false);
    const[hideTimeout,setHideTimeout]=useState<NodeJS.Timeout|null>(null)
   const handleMouseEnter=()=>{

if(hideTimeout) clearTimeout(hideTimeout)
  setIsHovered(true)
   }

   const handleMouseLeave=()=>{

    const timeout=setTimeout(()=>{
      setIsHovered(false)
    },200)

    setHideTimeout(timeout)

   

   }
    
  return (
    <div
    className=''
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}>
         {children}
         <div className=' relative'
         
         >
         {
            ishovered&&

            <HoverProfileDetail hoverId={userId}/>
         } 
         </div>     
    </div>
  )
}

export default HoverWrapper