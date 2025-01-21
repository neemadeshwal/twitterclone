import React, { useEffect, useRef, useState } from 'react';
import { BiChevronLeft, BiChevronRight, BiX } from 'react-icons/bi';
import { BsEmojiSmile, BsFeather } from 'react-icons/bs';
import CurrentUser from './currentUser';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { MdOutlineGifBox } from 'react-icons/md';
import { RiListRadio } from 'react-icons/ri';
import { LuDot, LuFolderClock } from 'react-icons/lu';
import { FiMapPin } from 'react-icons/fi';
import ReactDOM from 'react-dom';
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";


import DivisionBar from './divisionbar';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTweetMutate } from '@/graphql/mutation/tweet';
import { previewFile } from '@/lib/uploadFile';
import HashtagContainer from './HashtagContainer';
import Image from 'next/image';
import GifContainer from './GifContainer';

const PostContainer = () => {
  const [showRightChevron, setShowRightChevron] = useState(false);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [isContainerOpen, setIsContainerOpen] = useState(false);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [openGifContainer, setOpenGifContainer] = useState(false);
  const [isEmojiTableOpen, setIsEmojiTableOpen] = useState(false);
  const [isHashTagDialogOpen, setHashTagDialog] = useState(false);
  const [hashtagPart, setHashtagPart] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [tweetContent, setTweetContent] = useState("");
  const mutation = useMutation({
    mutationFn: createTweetMutate,
    onSuccess: (response: any) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["all-tweet"] });
      setTweetContent("");
      setFiles([]);
      setIsContainerOpen(false)
    },
    onError: (error) => {
      console.log(error);
    },
  });
  async function onSubmit() {
    let photoArray: string[] = [];
    let videoArray: string[] = [];
    if (files.length !== 0) {
      files.map((url) => {
        if (url.endsWith("mp4")) {
          videoArray.push(url);
        } else {
          photoArray.push(url);
        }
      });
    }
    const body = {
      content: tweetContent,
      photoArray,
      videoArray,
    };
    try {
      await mutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleImgUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    setLoading(true);
    try {
      const fileUrl = await previewFile(event.target.files);
      console.log(fileUrl, "fileUrl");
      if (fileUrl && fileUrl.length !== 0) {
        setFiles((prevVal) => [...prevVal, ...fileUrl]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(()=>{
    if(isContainerOpen){
      document.body.style.overflow="hidden"
    }
    else{
      document.body.style.overflow=""

    }
    return () => {
      document.body.style.overflow = '';
    };
  },[isContainerOpen])
  const emojiCloseRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (dir: string) => {
    if (scrollRef.current) {
      const scrollWidth = scrollRef.current.scrollWidth;
      const clientWidth = scrollRef.current.clientWidth;
      const scrollLeft = scrollRef.current.scrollLeft;
      console.log(scrollWidth - clientWidth, "minus effect");
      const scrollAmount = 250 + 16;
      const maxScrollLeft = scrollWidth - clientWidth;

      if (dir === "right") {
        scrollRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
        if (scrollLeft + scrollAmount >= maxScrollLeft) {
          setShowRightChevron(false);
        } else {
          setShowRightChevron(true);
        }
      } else {
        scrollRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
        if (scrollRef.current.scrollLeft <= 0) {
          setShowLeftChevron(false); // At the start of the scroll area
        } else {
          setShowLeftChevron(true); // Not at the start
        }
        if (scrollRef.current.scrollLeft + clientWidth < scrollWidth) {
          setShowRightChevron(true); // Show right chevron if we are not at the end
        }
      }

      console.log(clientWidth, "cleintwidht");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollWidth = scrollRef.current.scrollWidth;
        const clientWidth = scrollRef.current.clientWidth;
        const scrollLeft = scrollRef.current.scrollLeft;
        console.log(scrollWidth);

        setShowRightChevron(scrollLeft + clientWidth < scrollWidth);

        setShowLeftChevron(scrollLeft > 0);
      }
    };

    if (scrollRef.current) {
      console.log("hey");
      scrollRef.current.addEventListener("scroll", handleScroll);

      // Initial check
      handleScroll();
    }

    // Clean up event listener
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, [files, scrollRef]);
  const deletePreviewPhotos = async (deleteUrl: string) => {
    setFiles((prevVal) => prevVal.filter((url: string) => url !== deleteUrl));
  };
  function handleContentChange(content: string) {
    const parts = content.split(/(\s|$)/);
    const lastPart = parts[parts.length - 1];

    if (lastPart && lastPart.startsWith("#")) {
      if (lastPart.length > 1) {
        setHashTagDialog(true);
        setHashtagPart(lastPart);
      } else {
        setHashTagDialog(false);
        setHashtagPart("");
      }
    } else {
      setHashTagDialog(false);
      setHashtagPart("");
    }
    setTweetContent(content);
  }
  useEffect(() => {
    if (tweetContent.split("#")) {
      console.log(tweetContent);
    }
  }, [tweetContent]);
  useEffect(() => {
    const handleEmojiClose = (event: MouseEvent) => {
      if (
        emojiCloseRef.current &&
        !emojiCloseRef.current.contains(event.target as Node)
      ) {
        console.log("hey");
        setIsEmojiTableOpen(false);
      }
    };

    document.addEventListener("mousedown", handleEmojiClose);

    return () => {
      document.removeEventListener("mousedown", handleEmojiClose);
    };
  }, [isEmojiTableOpen, setIsEmojiTableOpen]);

  // Replace your element const with this:
const element = (
  <div className="fixed top-0 left-0 w-full h-full z-[100] dimBg flex items-center justify-center overflow-y-auto p-4">
    <div className="bg-black h-[50%] rounded-[20px] z-[1000] w-full max-w-2xl relative flex flex-col">
      {/* Header */}
      <div className="p-4 relative">
        <div
          className="absolute left-2 top-2 rounded-full p-1 hover:bg-[#0f0f0f] cursor-pointer"
          onClick={() => setIsContainerOpen(false)}
        >
          <BiX className="text-[30px]" />
        </div>
       
      </div>

      {/* Content */}
      <div className="">
        <div className='flex items-start gap-4 p-4 pt-8'>
      <div className="">
          <CurrentUser />
        </div>
        <textarea
          value={tweetContent}
          onChange={(e) => handleContentChange(e.target.value)}
          autoFocus
          className="w-full text-[20px] bg-transparent resize-none outline-none border-0 placeholder:text-gray-600"
          placeholder="What is happening?"
        />
        </div>

        {isHashTagDialogOpen && (
          <div className="mt-2">
            <HashtagContainer
              content={hashtagPart}
              tweetContent={tweetContent}
              setTweetContent={setTweetContent}
              setHashTagDialog={setHashTagDialog}
            />
          </div>
        )}

        {loading && <div>Loading....</div>}

        {/* Image Preview */}
        {files && files.length > 0 && (
          <div className="relative mt-4 w-full h-[350px]">
            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto h-full"
            >
              {files.map((url: string) => (
                <div
                  key={url}
                  className={`relative flex-shrink-0 h-full ${
                    files.length === 1 ? 'w-full' : 'w-[240px]'
                  }`}
                >
                  {url.endsWith(".mp4") ? (
                    <video
                      controls
                      loop
                      muted
                      className="w-full h-full rounded-2xl object-cover"
                    >
                      <source src={url} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="relative w-full h-full">
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="rounded-2xl object-cover"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => deletePreviewPhotos(url)}
                    className="absolute right-2 top-2 bg-black/40 hover:bg-black/60 rounded-full p-1"
                  >
                    <BiX className="text-white w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
            
            {showLeftChevron && (
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-gray-800 z-10"
              >
                <BiChevronLeft />
              </button>
            )}
            {showRightChevron && (
              <button
                onClick={() => handleScroll("right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-gray-800 z-10"
              >
                <BiChevronRight />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 absolute bottom-4 w-full">
        <DivisionBar type="x" />
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2">
            <label className="rounded-full p-2 hover:bg-[#081323] cursor-pointer">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleImgUpload}
              />
              <HiOutlinePhotograph className="text-[22px] x-textcolor" />
            </label>
            <button
              className="rounded-full p-2 hover:bg-[#081323]"
              onClick={() => setOpenGifContainer(true)}
            >
              <MdOutlineGifBox className="text-[22px] x-textcolor" />
            </button>
            <button className="rounded-full p-2 hover:bg-[#081323]">
              <RiListRadio className="text-[22px] x-textcolor" />
            </button>
            <button
              className="rounded-full p-2 hover:bg-[#081323]"
              onClick={() => setIsEmojiTableOpen(!isEmojiTableOpen)}
            >
              <BsEmojiSmile className="text-[22px] x-textcolor" />
            </button>
            <button className="rounded-full p-2 hover:bg-[#081323]">
              <LuFolderClock className="text-[22px] x-textcolor" />
            </button>
            <button className="rounded-full p-2 hover:bg-[#081323]">
              <FiMapPin className="text-[22px] x-textcolor" />
            </button>
          </div>
          <button
            onClick={onSubmit}
            className="py-2 px-4 rounded-full bg-blue-500 text-white"
          >
            Post
          </button>
        </div>
      </div>
    </div>

    {isEmojiTableOpen && (
      <div ref={emojiCloseRef} className="absolute left-1/2 -translate-x-1/2 z-[1001]">
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) =>
            setTweetContent((prevVal) => prevVal + emoji.native)
          }
        />
      </div>
    )}
    
    {openGifContainer && (
      <GifContainer setOpenGifContainer={setOpenGifContainer} />
    )}
  </div>
);

//   const element = (
//     <div className="fixed top-0 left-0 w-full h-full z-[100] dimBg flex items-center justify-center">
//       <div className="bg-black rounded-[20px] z-[1000] w-full max-w-2xl min-h-[50%] relative p-4 pt-14 h-auto flex gap-2">
//         <div
//           className="absolute top-2 left-2 rounded-full p-1 hover:bg-[#0f0f0f] cursor-pointer"
//           onClick={() => setIsContainerOpen(false)}
//         >
//           <BiX className="text-[30px]" />
//         </div>
//         <div className="flex w-fit items-center flex-col gap-1 h-full justify-center">
         
//           <div className="py-3 pt-5">
//             <CurrentUser />
//           </div>
//         </div>
//         <div className="w-full">
         
//           <div className="py-2 pt-4 w-full">
//             <div className="w-full mt-2 px-2">
//               <textarea
//               value={tweetContent}
//               onChange={(e) => handleContentChange(e.target.value)}

//                 autoFocus
//                 className="text-[20px] bg-transparent resize-none outline-none border-0 w-full placeholder:text-gray-600"
//                 placeholder="What is happening?"
//               ></textarea>
//                {isHashTagDialogOpen && (
//               <div className="mt-2">
//                 <HashtagContainer
//                   content={hashtagPart}
//                   tweetContent={tweetContent}
//                   setTweetContent={setTweetContent}
//                   setHashTagDialog={setHashTagDialog}
//                 />
//               </div>
//             )}
//               {loading && <div>Loading....</div>}
//               // Update the image preview section of your component with this code:
// {files && typeof files !== "undefined" && files.length !== 0 && (
//   <div className="relative w-full">
//     <div
//       ref={scrollRef}
//       className="flex gap-3 overflow-x-auto py-3 relative scrollbar-hide"
//       style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
//     >
//       {showLeftChevron && (
//         <div className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-gray-800 z-10 cursor-pointer">
//           <BiChevronLeft onClick={() => handleScroll("left")} />
//         </div>
//       )}
//       {showRightChevron && (
//         <div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-gray-800 z-10 cursor-pointer">
//           <BiChevronRight onClick={() => handleScroll("right")} />
//         </div>
//       )}

//       {files.map((url: string) => (
//         <div 
//           key={url} 
//           className={`flex-shrink-0 relative rounded-2xl ${
//             files.length === 1 ? 'w-full' : 'w-60'
//           }`}
//         >
//           {url.endsWith(".mp4") ? (
//             <div className="relative h-[350px] w-full">
//               <video
//                 controls
//                 loop
//                 muted
//                 className="w-full h-full rounded-2xl object-cover"
//               >
//                 <source src={url} type="video/mp4" />
//               </video>
//               <button
//                 onClick={() => deletePreviewPhotos(url)}
//                 className="absolute right-2 top-2 bg-black/40 hover:bg-black/60 rounded-full p-1"
//               >
//                 <BiX className="text-white w-6 h-6" />
//               </button>
//             </div>
//           ) : (
//             <div className="relative h-[350px] w-full">
//               <Image
//                 src={url}
//                 alt="Preview"
//                 fill
//                 className="rounded-2xl object-cover"
//               />
//               <button
//                 onClick={() => deletePreviewPhotos(url)}
//                 className="absolute right-2 top-2 bg-black/40 hover:bg-black/60 rounded-full p-1"
//               >
//                 <BiX className="text-white w-6 h-6" />
//               </button>
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   </div>
// )}
//             </div>
//           </div>
//         </div>
//         <div className="absolute bottom-4 left-4 w-full">
//           <div className='pr-6 py-4'>
//           <DivisionBar type='x'/>
            
//           </div>
//           <div className="flex justify-between pr-6">
//           <div className="flex gap-2 ">
//               <div className="rounded-full p-2 hover:bg-[#081323] ">
//                 <label htmlFor="file">
//                   <input
//                     type="file"
//                     id="file"
//                     multiple
//                     className="hidden"
//                     onChange={handleImgUpload}
//                   />
//                   <HiOutlinePhotograph className="text-[22px] x-textcolor " />
//                 </label>
//               </div>
//               <div
//                 className="rounded-full p-2 hover:bg-[#081323]"
//                 onClick={() => setOpenGifContainer(true)}
//               >
//                 <MdOutlineGifBox className="text-[22px] x-textcolor " />
//               </div>

//               <div className="rounded-full p-2 hover:bg-[#081323]">
//                 <RiListRadio className="text-[22px] x-textcolor " />
//               </div>

//               <div
//                 onClick={() => setIsEmojiTableOpen((prevVal) => !prevVal)}
//                 className="rounded-full p-2 hover:bg-[#081323]"
//               >
//                 <BsEmojiSmile className="text-[22px] x-textcolor " />
//               </div>

//               <div className="rounded-full p-2 hover:bg-[#081323]">
//                 <LuFolderClock className="text-[22px] x-textcolor " />
//               </div>
//               <div className="rounded-full p-2 hover:bg-[#081323]">
//                 <FiMapPin className="text-[22px] x-textcolor " />
//               </div>
//             </div>
//             <div>
//               <button
//                onClick={onSubmit}
//               className="py-2 rounded-full bg-blue-500 px-4 text-white">
//                 Post
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       {isEmojiTableOpen && (
//         <div ref={emojiCloseRef} className="absolute px-[10%] z-[1000]">
//           <div>
//             <Picker
//               data={data}
//               onEmojiSelect={(emoji: any) =>
//                 setTweetContent((prevVal) => prevVal + emoji.native)
//               }
//             />
//           </div>
//         </div>
//       )}
//       {openGifContainer && (
//         <GifContainer setOpenGifContainer={setOpenGifContainer} />
//       )}
//     </div>
//   );

  return (
    <div>
      <div
        onClick={() => setIsContainerOpen(true)}
        className="p-2 bg-white text-black w-fit flex fullWidth rounded-full my-2 cursor-pointer"
      >
        <div className="show-feather">
          <BsFeather className="text-[28px]" />
        </div>
        <p className="text-center hidden showPostName w-full justify-center items-center font-[700] text-[18px] showPost">
          Post
        </p>
      </div>

      {isContainerOpen && ReactDOM.createPortal(element, document.body)}
    </div>
  );
};

export default PostContainer;