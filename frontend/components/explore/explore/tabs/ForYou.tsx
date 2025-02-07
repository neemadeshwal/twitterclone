import SinglePost from '@/components/post/SinglePost/singlePost';
import { useGetAllTrending } from '@/hooks/tweet';
import DivisionBar from '@/shared/divisionbar';
import React from 'react'
import SingleTweetHighlight from './SingleTweetHighlight';

const ForYou = () => {
    const { allTrending } = useGetAllTrending();
  
  return (
    <div>
      <div>
        {
          allTrending?.trendingTweet&&allTrending.trendingTweet.length!==0&&
          (<div>
          <div>
            <div className="py-6  px-6">
                <h3 className="text-[20px] font-[800]">People</h3>
              </div>
              <div className="flex flex-col gap-6 px-4">
                {allTrending?.trendingTweet.map((item: any) => {
                  return (

                    <SingleTweetHighlight tweet={item} key={item.id}/>
                  );
                })}
              </div>
          </div>
        <DivisionBar type='x'/> 
        </div> 
        )
        }
        <DivisionBar type='x'/> 



      </div>
    </div>
  )
}

export default ForYou