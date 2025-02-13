import SinglePost from '@/components/post/SinglePost/singlePost'
import { Tweet } from '@/graphql/types'
import Loading from '@/shared/loading';
import React from 'react'

const Latest = ({tweetList,query}:{tweetList:Tweet[],query:string}) => {
  console.log(tweetList,query,"tweetlistinsearch")
  if (!tweetList) {
    return (
      <div className="flex justify-center py-4">
        <Loading/>
      </div>
    );
  }
  
  if (tweetList && !tweetList.length) {
    return (
      <div className="py-10 flex flex-col justify-center items-center">
        <h3 className="text-lg font-bold mb-4">No results for {query}</h3>
        <p className="text-gray-500 text-sm">
          Try searching for something else
        </p>
      </div>
    );
  }
  return (
    <div>
    <div>
      {tweetList &&
        tweetList.length !== 0 &&
        tweetList.map((tweet) => <SinglePost tweet={tweet} key={tweet.id} />)}
    </div>
  </div>
  )
}

export default Latest