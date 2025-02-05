"use client";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import React, { useEffect, useState } from "react";
import Loading from "./loading";

const gridGifContainer = ({
  searchGif,
  fetched,
  setOpenGifContainer,
  setFiles,
}: any) => {
  const fetchGif = new GiphyFetch("pxCY8oOUaehMopzZV52Qi2KKDgHIv1wl");
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);
  const trendingGifs = async () => {
    const response = await fetchGif.trending({ limit: 20 });
    console.log(response.data);
    return response; // Return the response to the Grid component
  };

  // Function to fetch search results
  const searchGifs = async () => {
    console.log("searchgif");
    const response = await fetchGif.search(searchGif, { limit: 20 });
    console.log(response);

    return response; // Return the search result to the Grid component
  };
  console.log(selectedGif, "selectedgif");
  useEffect(() => {
    if (selectedGif) {
      setFiles((prevVal: any) => [...prevVal, selectedGif]);
      setOpenGifContainer(false);
    }
  }, [selectedGif]);
  return fetched ? (
    <div className="overflow-y-auto h-[80vh] flex flex-wrap ">
      {!searchGif ? (
        <Grid
          fetchGifs={trendingGifs}
          onGifClick={(gif, event) => {
            console.log(gif);
            event.preventDefault();
            setSelectedGif(gif.images.original.url);
          }}
          width={containerWidth - 500}
          columns={5}
          gutter={6}
        />
      ) : (
        <Grid
          fetchGifs={searchGifs}
          onGifClick={(gif, event) => {
            console.log(gif);
            event.preventDefault();
            setSelectedGif(gif.images.original.url);
          }}
          width={500}
          columns={3}
          gutter={6}
        />
      )}
      {selectedGif && (
        <div className="selected-gif-container">
          <img src={selectedGif} alt="Selected GIF" className="selected-gif" />
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center justify-center w-full h-full">
      <Loading />
    </div>
  );
};

export default gridGifContainer;
