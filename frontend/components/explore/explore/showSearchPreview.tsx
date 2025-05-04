import { HashTag } from "@/graphql/types";
import DivisionBar from "@/shared/divisionbar";
import { Icons } from "@/utils/icons";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface PeopleProps {
  userName: string;
  profileImgUrl?: string;
  firstName: string;
  lastName: string;
  id: string;
}

interface SearchPreviewProps {
  isSearchPreviewOpen: boolean;
  setIsSearchPreviewOpen: (isOpen: boolean) => void;
  allSearchResult: {
    hashtag: HashTag[];
    people: PeopleProps[];
  } | null;
  setQuery: (query: string) => void;
  isLoading: boolean;
}

// Separate component for profile image
const ProfileImage = ({ user }: { user: PeopleProps }) => {
  if (!user.profileImgUrl) {
    return (
      <div className="flex items-center justify-center capitalize cursor-pointer">
        <p className="bg-green-900 rounded-full w-8 h-8 flex items-center justify-center">
          {user.firstName.slice(0, 1)}
        </p>
      </div>
    );
  }

  if (user.profileImgUrl.startsWith("#")) {
    return (
      <div className="flex items-center justify-center capitalize cursor-pointer">
        <p
          style={{ backgroundColor: user.profileImgUrl }}
          className="rounded-full w-8 h-8 flex items-center justify-center"
        >
          {user.firstName.slice(0, 1)}
        </p>
      </div>
    );
  }

  return (
    <Image
      src={user.profileImgUrl}
      alt={`${user.firstName}'s profile`}
      width={32}
      height={32}
      className="rounded-full"
    />
  );
};

// Separate component for hashtag item
const HashtagItem = ({ hashtag }: { hashtag: HashTag }) => (
  <Link href={`/search?q=%23${hashtag.text.slice(1)} `}>
    <div className="flex gap-3 items-center hover-bg cursor-pointer py-3 px-6">
      <div>
        <Icons.SearchIcon className="w-6 h-6" />
      </div>
      <div className="leading-[20px]">
        <p>{hashtag.text}</p>
        <p className="gray capitalize text-[14px]">trending</p>
      </div>
    </div>
  </Link>
);

// Separate component for person item
const PersonItem = ({ person }: { person: PeopleProps }) => (
  <Link href={`/${person.userName}`}>
    <div className="hover-bg cursor-pointer py-3 px-6">
      <div className="flex gap-2 items-center">
        <ProfileImage user={person} />
        <div>
          <h3 className="text-[16px] font-[500] capitalize hover:underline underline-white cursor-pointer">
            {person.firstName} {person.lastName}
          </h3>
          <p className="gray text-[14px] font-[300] break-all">
            @{person.userName}
          </p>
        </div>
      </div>
    </div>
  </Link>
);

// Custom hook for recent searches
const useRecentSearches = () => {
  const [recentSearch, setRecentSearch] = useState<string[]>([]);

  const deleteAllRecentSearch = () => {
    localStorage.removeItem("recentSearch");
    setRecentSearch([]);
  };

  const deleteSearchByName = (name: string) => {
    const newArr = recentSearch.filter((item) => item !== name);
    setRecentSearch(newArr);
    localStorage.setItem("recentSearch", JSON.stringify(newArr));
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentSearch");
      if (stored) {
        setRecentSearch(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  }, []);

  return { recentSearch, deleteAllRecentSearch, deleteSearchByName };
};

const ShowSearchPreview: React.FC<SearchPreviewProps> = ({
  setIsSearchPreviewOpen,
  allSearchResult,
  setQuery,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const { recentSearch, deleteAllRecentSearch, deleteSearchByName } =
    useRecentSearches();

  useEffect(() => {
    const handleClosePreview = (event: MouseEvent) => {
      if (
        previewRef.current &&
        !previewRef.current.contains(event.target as Node)
      ) {
        setIsSearchPreviewOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClosePreview);
    return () => document.removeEventListener("mousedown", handleClosePreview);
  }, [setIsSearchPreviewOpen]);

  return (
    <div
      ref={previewRef}
      style={{ boxShadow: "0 0 6px rgba(255, 255, 255, 0.6)" }}
      className="bg-black w-[350px] rounded-[10px] z-50 sm:w-full absolute min-h-[100px] max-h-[300px] h-auto overflow-auto my-2"
    >
      {allSearchResult &&
      allSearchResult.hashtag.length + allSearchResult.people.length > 0 ? (
        <div>
          {allSearchResult.hashtag.length > 0 && (
            <>
              {allSearchResult.hashtag.map((item) => (
                <HashtagItem key={item.id} hashtag={item} />
              ))}
              <div className="py-1">
                <DivisionBar type="x" />
              </div>
            </>
          )}

          {allSearchResult.people.length > 0 &&
            allSearchResult.people.map((item) => (
              <PersonItem key={item.id} person={item} />
            ))}
        </div>
      ) : recentSearch.length > 0 ? (
        <div className="py-3">
          <div className="flex justify-between items-center px-4">
            <p className="capitalize text-[18px] font-[600]">recent</p>
            <button
              onClick={deleteAllRecentSearch}
              className="capitalize text-[14px] x-textcolor rounded-full px-2 hover:bg-[#29387060] cursor-pointer"
            >
              clear all
            </button>
          </div>
          <div className="py-2">
            {recentSearch.map((item) => (
              <div
                key={item}
                className="hover-bg flex px-4 items-center cursor-pointer py-3 justify-between"
              >
                <div
                  className="flex items-center gap-4 flex-1"
                  onClick={() => setQuery(item)}
                >
                  <Icons.Search className="w-6 h-6" />
                  <p>{item}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSearchByName(item);
                  }}
                >
                  <Icons.XIcon className="x-textcolor w-6 h-6" />
                </button>
              </div>
            ))}
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
