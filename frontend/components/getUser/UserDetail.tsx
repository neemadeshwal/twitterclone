"use client"

import { useGetUserByUserName } from "@/hooks/user"
import { usePathname } from "next/navigation"

import React, { useState } from 'react'
import UserDetailHeader from "./UserDetailHeader"
import ProfileDisplay from "./proflleDisplay"
import Loading from "@/shared/loading"

const UserDetail = () => {
  const currentPathname=usePathname()
  const {user}=useGetUserByUserName(currentPathname.slice(1))

  if(!user){
    return <div className="flex justify-center py-10"><Loading/></div>
  }

  return (
    <div>
      <UserDetailHeader user={user}/>
      <ProfileDisplay user={user}/>
    </div>
  )
}

export default UserDetail