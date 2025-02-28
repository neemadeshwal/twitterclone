import { authorType } from '@/graphql/types'
import { Icons } from '@/utils/icons'
import React from 'react'

const UserDetailHeader = ({user}:{user:authorType}) => {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-sm py-1 px-2 sm:px-4 bg-black/60">
        <div className="flex gap-9 items-center ">
          <div>
            <Icons.ArrowLeft />
          </div>
          <div>
            <h2 className="font-[600] text-[18px] capitalize">
              {user?.firstName} {user?.lastName}
            </h2>
            <h4 className="font-[300] gray text-[14px]">
              {user?.posts.length} posts
            </h4>
          </div>
        </div>
      </div>
  )
}

export default UserDetailHeader