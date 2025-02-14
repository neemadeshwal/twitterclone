import Loading from "@/shared/loading";
import ScrollTop from "@/shared/ScrollTop";
import Image from "next/image";
import React from "react";

const MediaTab = ({ query, searchResult, isLoading }: any) => {
  if (isLoading||!searchResult) {
    return (
      <div className="flex justify-center py-10">
        <Loading />
      </div>
    );
  }
  if (
    searchResult &&
    searchResult?.media &&
    !searchResult.media.length &&
    !searchResult.media.mediaArray.length
    ) {
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
      <ScrollTop/>
      <div className="grid grid-flow-row grid-cols-3 gap-1 px-1 py-1">
        {searchResult.media.map((mediaItem:any)=>{
          return(
            <div key={mediaItem.id} className="">
              {
                mediaItem.mediaArray.map((item: string) => {
                  return (
                    <div className="" key={item}>
                      <Image
                        src={item}
                        alt=""
                        width={500}
                        height={500}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              
            </div>
          )
        })}
        
      </div>
    </div>
  );
};

export default MediaTab;
