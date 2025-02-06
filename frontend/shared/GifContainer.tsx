"use client";
import React, { useEffect, useRef, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { GiphyFetch } from "@giphy/js-fetch-api";
import GridGifContainer from "./gridGifContainer";
import { GIF_KEY } from "@/lib/constants";

const GifContainer = ({
  setOpenGifContainer,
  setFiles,
  gifContainerRef
}: {
  setOpenGifContainer: any;
  setFiles?: any;
  gifContainerRef:any;
}) => {



  const [fetched, setFetched] = useState(false);
  const [searchGif, setSearchGif] = useState("");
  
  const fetchGif = new GiphyFetch(GIF_KEY!);
  const trendingGifs = async () => {
    const response = await fetchGif.trending({ limit: 7 });
    console.log(response.data);
    return response;
  };

  const searchGifs = async () => {
    const response = await fetchGif.search(searchGif, { limit: 6 });
    console.log(response);

    return response; 
  };

  useEffect(() => {
    searchGif
      ? searchGifs().then((res) => {
          setFetched(true);
        })
      : trendingGifs().then((res) => {
          setFetched(true);
        });
  }, [searchGif, fetch]);

 
  return (
    <div className="fixed top-0 left-0 w-full h-full z-[1000] dimBg flex items-center justify-center">
      <div ref={gifContainerRef} className="bg-black md:rounded-[20px] z-50 w-full md:w-[45%] h-full md:min-h-[55%] md:h-[90%] relative">
        <div className="sticky top-0 z-[1000] backdrop-blur-sm rounded-[20px]">
          <div
            className="absolute top-1 left-1 rounded-full cursor-pointer p-2"
            onClick={() => setOpenGifContainer(false)}
          >
            <BiX className="w-7 h-7" />
          </div>
          <div className="flex justify-center mt-4 w-full">
            <div className="flex justify-center w-[80%] py-3 relative">
              <input
                onChange={(e) => setSearchGif(e.target.value)}
                className="rounded-full w-full border border-gray-500 bg-transparent px-12 py-2 focus:border-transparent focus:outline-none"
                id="gif"
                placeholder="search gif"
                type="text"
              />
              <div className="absolute left-4 top-[30%] h-full">
                <BiSearch
                  style={{ strokeWidth: "1px" }}
                  className="w-6 font-[300] h-6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 ">
          <GridGifContainer
            searchGif={searchGif}
            fetched={fetched}
            setOpenGifContainer={setOpenGifContainer}
            setFiles={setFiles}
          />
        </div>
      </div>
    </div>
  );
};

export default GifContainer;
