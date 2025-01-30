import Image from 'next/image'
import React from 'react'

const PostContent = ({content,hashtags,mediaArray}:{content:string,hashtags:any,mediaArray:string[]}) => {
  return (
    <div>
        <div className="mt-1"
        //  onClick={() => handlePostClick(tweet.id)}
         >
            {content}

            {hashtags&&hashtags?.length !== 0 && (
              <div className="mt-2">
                {hashtags?.map((item:any) => (
                  <span key={item.id} className="x-textcolor">
                    {item.text}{" "}
                  </span>
                ))}
              </div>
            )}
          </div>
          {mediaArray && mediaArray.length !== 0 && (
            <div
              className={`my-2 grid w-full border border-gray-600 z-50 overflow-hidden rounded-[20px] gap-x-[2px] gap-y-[2px] grid-flow-row ${
                mediaArray.length > 2
                  ? "grid-cols-2 h-[250px] xs:h-[300px] sm:h-[400px] md:h-[500px]"
                  : mediaArray.length === 2
                  ? "grid-cols-2 h-[180px] xs:h-[250px]  sm:h-[350px] gap-x-[2px]"
                  : "grid-cols-1 h-[180px] sm:h-[500px] xs:h-[300px] "
              }`}
            >
              {mediaArray?.map((url, index) => (
                <div
                //   onClick={() => handlePostPhotoClick(tweet.id, index + 1)}
                  key={url}
                  className="relative overflow-hidden"
                >
                  {url.endsWith(".mp4") ? (
                    <video
                      controls
                      loop
                      autoPlay
                      className="w-full h-full object-cover"
                      muted
                    >
                      <source src={url} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={url}
                      alt="Tweet media"
                      width={400}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
    </div>
  )
}

export default PostContent