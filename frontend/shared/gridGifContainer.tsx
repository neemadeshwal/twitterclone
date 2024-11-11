import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import React from "react";

const gridGifContainer = ({ searchGif, fetched }: any) => {
  const fetchGif = new GiphyFetch("pxCY8oOUaehMopzZV52Qi2KKDgHIv1wl");

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
  return fetched ? (
    <div className="overflow-auto h-[400px] w-full">
      {!searchGif ? (
        <Grid
          fetchGifs={trendingGifs}
          onGifClick={(gif) => console.log(gif)}
          width={500}
          columns={3}
          gutter={6}
        />
      ) : (
        <Grid
          fetchGifs={searchGifs}
          onGifClick={(gif) => console.log(gif)}
          width={500}
          columns={3}
          gutter={6}
        />
      )}
    </div>
  ) : (
    <div className="loader">Loading...</div>
  );
};

export default gridGifContainer;
