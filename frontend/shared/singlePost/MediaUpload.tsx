import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import React, { useRef } from "react";
import { BiX } from "react-icons/bi";

const MediaUpload = ({
  files,
  setFiles,
}: {
  files: string[];
  setFiles: any;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const deletePreviewPhotos = async (deleteUrl: string) => {
    setFiles((prevVal: string[]) =>
      prevVal.filter((url: string) => url !== deleteUrl)
    );
  };
  return (
    <div>
      {
        <div ref={scrollRef}>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {files.map((url: string) => {
                return (
                  <CarouselItem key={url} className="relative   basis-1/2">
                    <div className="rounded-[20px] py-3 flex aspect-square  items-center justify-center  ">
                      {url.endsWith(".mp4") ? (
                        <div className="rounded-[20px] relative">
                          <video
                            controls
                            width="250"
                            height="250"
                            loop
                            className="w-full h-full rounded-[20px] object-cover"
                            muted
                          >
                            <source src={url} type="video/mp4" />
                          </video>

                          <BiX
                            onClick={() => deletePreviewPhotos(url)}
                            className="absolute bg-black/40 text-white w-7 h-7 hover:bg-black/50 cursor-pointer rounded-full right-3 top-3"
                          />
                        </div>
                      ) : (
                        <div className="rounded-[20px] relative h-full">
                          <Image
                            src={url}
                            alt=""
                            width={500}
                            height={500}
                            className="w-full h-full rounded-[20px] object-cover"
                          />
                          <div>
                            <BiX
                              onClick={() => deletePreviewPhotos(url)}
                              className="absolute bg-[#232323b5] hover:bg-[#2323237d] text-white w-7 h-7 cursor-pointer rounded-full right-3 top-3"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            <CarouselPrevious className="absolute bg-[#232323b5] hover:bg-[#2323237d] hover:text-white rounded-full border-0 cursor-pointer p-2 left-0 top-[50%]" />

            <CarouselNext className="absolute bg-[#232323b5] hover:bg-[#2323237d] hover:text-white border-0 rounded-full cursor-pointer p-2 right-0 top-[50%]" />
          </Carousel>
        </div>
      }
    </div>
  );
};

export default MediaUpload;
