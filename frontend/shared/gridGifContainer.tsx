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
  const viewportHeight = window.innerHeight;
  const trendingGifs = async () => {
    const response = await fetchGif.trending({ limit: 20 });
    console.log(response.data);
    return response;
  };

  const searchGifs = async () => {
    console.log("searchgif");
    const response = await fetchGif.search(searchGif, { limit: 20 });
    console.log(response);

    return response;
  };
  console.log(selectedGif, "selectedgif");
  useEffect(() => {
    if (selectedGif) {
      setFiles((prevVal: any) => [...prevVal, selectedGif]);
      setOpenGifContainer(false);
    }
  }, [selectedGif]);
  return fetched ? (
    <div
      style={{ height: `${viewportHeight - 200}px` }}
      className={`overflow-y-auto  flex flex-wrap`}
    >
      {!searchGif ? (
        <Grid
          fetchGifs={trendingGifs}
          onGifClick={(gif, event) => {
            console.log(gif);
            event.preventDefault();
            setSelectedGif(gif.images.original.url);
          }}
          width={500}
          columns={3}
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
