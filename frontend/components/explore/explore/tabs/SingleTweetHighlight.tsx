import { formatTimeAgo, getDateTime } from "@/lib/timeStamp";
import AuthorProfile from "@/shared/AuthorProfile";
import { Icons } from "@/utils/icons";
import Image from "next/image";
import React from "react";

const SingleTweetHighlight = ({ tweet }: { tweet: any }) => {

 
  return (
    <div key={tweet.key}>
      <div className="flex justify-between">
        <div>
          <h2>{tweet.content?tweet.content.slice(0,50):"....."}</h2>
          <div className="flex gap-1 gray text-[14px] items-center">
           <div className="flex -space-x-[0.9rem]">
            {tweet.LikedBy.length!==0&&tweet.LikedBy.slice(0,3).map((item:any,index:number)=>{
             return(
                <div className=" ring-2 ring-black rounded-full  scale-75" key={item.id}  style={{
                  zIndex: tweet.LikedBy.length - index
                }}>
                  <AuthorProfile isSmall={true} author={item.user}/>
                 
                </div>
              )
            })}
           </div>

           
           <p>
           {formatTimeAgo(getDateTime(tweet?.createdAt))} ago
            </p>
            <Icons.Dot/>
            <p>{tweet.LikedBy.length} likes</p>
          </div>
        </div>
        <div>
          {tweet.mediaArray && tweet.mediaArray.length !== 0 && (
            <div className={`relative overflow-hidden "}`}>
              {tweet.mediaArray[0].endsWith(".mp4") ? (
                <video
                  controls
                  loop
                  autoPlay
                  className="w-[80px] h-[80px] rounded-[15px] object-cover"
                  muted
                >
                  <source src={tweet.mediaArray[0]} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={tweet.mediaArray[0]}
                  alt="Tweet media"
                  width={400}
                  height={500}
                  className="w-[80px] h-[80px] rounded-[15px] object-cover"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleTweetHighlight;
