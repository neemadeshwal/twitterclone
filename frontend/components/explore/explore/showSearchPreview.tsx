import { HashTag } from "@/graphql/types";
import DivisionBar from "@/shared/divisionbar";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";

interface peopleProps {
  userName: string;
  profileImgUrl?: string;
  firstName: string;
  lastName: string;
  id: string;
}

const ShowSearchPreview = ({
  isSearchPreviewOpen,
  setIsSearchPreviewOpen,
  allSearchResult,
  setQuery,
}: any) => {
  const [recentSearch, setRecentSearch] = useState<string[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const deleteAllRecentSearch = () => {
    const getRecentSearch = localStorage.getItem("recentSearch");
    if (!getRecentSearch) {
      return;
    }
    localStorage.removeItem("recentSearch");
  };
  const deleteSearchByName = (name: string) => {
    const getRecentSearch = localStorage.getItem("recentSearch");
    if (!getRecentSearch) {
      return;
    }
    const parseSearch = JSON.parse(getRecentSearch);
    if (!Array.isArray(parseSearch)) {
      return;
    }
    const newArr = parseSearch.filter((item) => item !== name);
    setRecentSearch(newArr);

    localStorage.setItem("recentSearch", JSON.stringify(newArr));
  };
  useEffect(() => {
    const getRecentSearch = localStorage.getItem("recentSearch");
    console.log(getRecentSearch, "recent search");
    if (!getRecentSearch) {
      return;
    }
    setRecentSearch(JSON.parse(getRecentSearch));
  }, []);

  useEffect(() => {
    const handleClosePreview = (event: MouseEvent) => {
      if (
        previewRef.current &&
        !previewRef.current.contains(event.target as Node)
      ) {
        setIsSearchPreviewOpen(false);
      }
      document.addEventListener("mousedown", handleClosePreview);

      return () => {
        document.removeEventListener("mousedown", handleClosePreview);
      };
    };
  }, [setIsSearchPreviewOpen]);
  return (
    <div
      ref={previewRef}
      style={{
        boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
      }}
      className="bg-black  rounded-[10px] z-50 w-full absolute min-h-[100px] max-h-[300px] h-auto overflow-auto my-2 "
    >
      {allSearchResult && allSearchResult.length !== 0 ? (
        <div>
          {allSearchResult.hashtag.length !== 0 &&
            allSearchResult.hashtag.map((item: HashTag) => {
              return (
                <div
                  className="flex gap-3 items-center hover-bg cursor-pointer py-3 px-6"
                  key={item.id}
                >
                  <div>
                    <BiSearch className="w-6 h-6" />
                  </div>
                  <div className="leading-[20px]">
                    <p>{item.text}</p>
                    <p className="gray capitalize text-[14px]">trending</p>
                  </div>
                </div>
              );
            })}

          <div className="py-1">
            <DivisionBar type="x" />
          </div>
          {allSearchResult.people.length !== 0 &&
            allSearchResult.people.map((item: peopleProps) => {
              return (
                <div
                  className=" hover-bg cursor-pointer py-3 px-6"
                  key={item.id}
                >
                  <div className="flex gap-2 items-center">
                    <div>
                      {item.profileImgUrl ? (
                        <div>
                          {item.profileImgUrl.startsWith("#") ? (
                            <div className=" flex items-center justify-center capitalize  cursor-pointer">
                              <p
                                style={{
                                  backgroundColor: item?.profileImgUrl,
                                }}
                                className=" rounded-full w-8 h-8 flex items-center justify-center "
                              >
                                {item?.firstName.slice(0, 1)}
                              </p>
                            </div>
                          ) : (
                            <Image
                              src={item?.profileImgUrl}
                              alt=""
                              width={100}
                              height={100}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                        </div>
                      ) : (
                        <div className=" flex items-center justify-center capitalize  cursor-pointer">
                          <p className="bg-green-900 rounded-full w-10 h-10 flex items-center justify-center ">
                            {item?.firstName.slice(0, 1)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-[16px] font-[500] capitalize hover:underline underline-white cursor-pointer">
                        {item?.firstName} {item?.lastName}
                      </h3>
                      <p className="gray text-[14px] font-[300] break-all">
                        @{item?.userName}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : recentSearch.length !== 0 ? (
        <div className="py-3 ">
          <div className=" flex justify-between items-center px-4">
            <p className="capitalize text-[18px] font-[600]">recent</p>
            <button
              onClick={deleteAllRecentSearch}
              className="capitalize text-[14px] x-textcolor rounded-full px-2 hover:bg-[#29387060] cursor-pointer"
            >
              clear all
            </button>
          </div>
          <div className="py-2">
            {recentSearch.map((item) => {
              return (
                <div
                  onClick={() => setQuery(item)}
                  key={item}
                  className="hover-bg flex px-4 items-center cursor-pointer py-3 justify-between"
                >
                  <div className="flex items-center gap-4">
                    <BiSearch className="w-6 h-6" />
                    <p>{item}</p>
                  </div>
                  <div onClick={() => deleteSearchByName(item)}>
                    <BiX className="x-textcolor w-6 h-6" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-center py-3 gray">
          Try searching for people, lists, or keywords
        </p>
      )}
    </div>
  );
};

export default ShowSearchPreview;
