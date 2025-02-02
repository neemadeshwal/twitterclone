import React, { useState } from 'react'
import { IoEllipsisHorizontal } from 'react-icons/io5'
import PostActivity from '../postActivity'
import { Tweet } from '@/graphql/types'

const PostControlDialog = ({tweet}:{tweet:Tweet}) => {
    const[isPostControlDialogOpen,setPostControlDialogOpen]=useState(false)
  return (
    <div>
           <div className="" >
              <div className="p-2 rounded-full absolute top-0 right-8 hover:bg-[#1e2034a5] gray hover:text-blue-500 hidden md:inline-block">
                <IoEllipsisHorizontal onClick={()=>setPostControlDialogOpen(true)} className="" />

                 {isPostControlDialogOpen && (
                  <PostActivity
                    singleTweet={tweet}
                    setPostControlDialogOpen={setPostControlDialogOpen}
                  />
                )} 
              </div>
            </div>
    </div>
  )
}

export default PostControlDialog