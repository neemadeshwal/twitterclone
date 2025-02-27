import { Icons } from '@/utils/icons'
import React from 'react'

const loading = () => {
  return (
    <div className='bg-black z-[1000000] fixed top-0   text-6xl md:text-[100px] right-0 w-full h-full text-white overflow-hidden flex items-center justify-center'>
        <Icons.TwitterX/>
    
      </div>
  )
}

export default loading