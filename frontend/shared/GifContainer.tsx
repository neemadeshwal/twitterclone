"use client";
import React, { useEffect, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { Grid } from "@giphy/react-components";
import { GiphyFetch } from "@giphy/js-fetch-api";
import Image from "next/image";
import GridGifContainer from "./gridGifContainer";

const GifContainer = ({
  setOpenGifContainer,
  setFiles
}: {
  setOpenGifContainer: any;
  setFiles?:any
}) => {
  const [fetched, setFetched] = useState(false);
  const [searchGif, setSearchGif] = useState("");
  const [gifContainer, setGifContainer] = useState<any>([]);
  const fetchGif = new GiphyFetch("pxCY8oOUaehMopzZV52Qi2KKDgHIv1wl");

  // Function to fetch trending GIFs
  const trendingGifs = async () => {
    const response = await fetchGif.trending({ limit: 7 });
    setGifContainer(response.data);
    console.log(response.data);
    return response; // Return the response to the Grid component
  };

  // Function to fetch search results
  const searchGifs = async () => {
    console.log("searchgif");
    const response = await fetchGif.search(searchGif, { limit: 6 });
    console.log(response);
    setGifContainer(response.data);

    return response; // Return the search result to the Grid component
  };
  console.log(searchGif, "sejalj");

  useEffect(() => {
    setFetched(false);
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
      <div className="bg-black rounded-[20px] z-50 w-[45%] min-h-[65%] h-[90vh] relative">
        <div className="sticky top-0 z-[1000] backdrop-blur-sm rounded-[20px]">
          <div
            className="absolute top-2 left-2 rounded-full cursor-pointer p-2"
            onClick={() => setOpenGifContainer(false)}
          >
            <BiX className="w-7 h-7" />
          </div>
          <div className="flex justify-center w-full">
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
          <GridGifContainer searchGif={searchGif} fetched={fetched} setOpenGifContainer={setOpenGifContainer} setFiles={setFiles}/>
          {/* {gifContainer?.length !== 0 &&
            gifContainer?.map((item: any) => {
              return (
                <div key={item.id}>
                  <Image
                    src={item.images.original.url}
                    alt=""
                    width={300}
                    height={300}
                  />
                </div>
              );
            })} */}
        </div>
      </div>
    </div>
  );
};

export default GifContainer;
