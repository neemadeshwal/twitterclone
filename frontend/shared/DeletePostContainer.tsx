// import React, { useState } from "react";
// import { MdDelete } from "react-icons/md";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { deleteTweetMutate } from "@/graphql/mutation/tweet";
// import PortalContainerWrapper from "./PortalContainerWrapper";

// const DeletePostContainer = ({
//   postId,
//   setPostControlDialogOpen,
// }: {
//   postId: string;

//   setPostControlDialogOpen: any;
// }) => {
//   const queryClient = useQueryClient();

//   const [deleteDialog, setDeleteDialog] = useState(false);
//   const mutation = useMutation({
//     mutationFn: deleteTweetMutate,
//     onSuccess: (response: any) => {
//       queryClient.invalidateQueries({
//         queryKey: ["all-tweet"],
//       });
//       setDeleteDialog(false);
//       queryClient.refetchQueries({ queryKey: ["all-tweet"] });
//     },
//   });
//   const handleDeletePost = async (id: string) => {
//     if (!id) {
//       return;
//     }
//     const body = {
//       tweetId: id,
//     };
//     try {
//       await mutation.mutateAsync(body);
//       setDeleteDialog(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const element = (
//     <div  className="z-[1000000] flex justify-center items-center w-screen h-screen fixed dimBg gray top-0 left-0 p-6">
//       <div  className="h-auto z-[10000] p-6 w-auto rounded-[15px] bg-black flex flex-col gap-4 max-w-[290px]">
//         <div className="flex flex-col gap-2 ">
//           <h2 className="capitalize text-white text-[20px] font-[700]">
//             delete post?
//           </h2>
//           <p className="text-[14px]">
//             This can’t be undone and it will be removed from your profile, the
//             timeline of any accounts that follow you, and from search results.{" "}
//           </p>
//         </div>

//         <div className="flex flex-col gap-3 capitalize font-[600] z-[100]">
//           <button
//             className="bg-[#f4212e] text-white rounded-[20px] capitalize py-2"
//             onClick={() => handleDeletePost(postId)}
//           >
//             delete
//           </button>
//           <button
//             className="text-white rounded-[20px] border-[1px] border-gray-500 py-2 capitalize"
//             onClick={(event) => {
//               event.stopPropagation();
//               setDeleteDialog(false);
//             }}
//           >
//             cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   const triggerComp = (
//     <button
//       onClick={(e) => {
//         e.stopPropagation();
//         setDeleteDialog(true);
//       }}
//       className="flex gap-3 items-center font-[600] text-red-500"
//     >
//       <MdDelete className="font-[600] text-[20px]" />
//       Delete
//     </button>
//   );

//   return (
//     <PortalContainerWrapper
//       triggerComp={triggerComp}
//       isDialogTriggered={deleteDialog}
//       element={element}
//     />
//   );
// };

// export default DeletePostContainer;


import { deleteTweetMutate } from '@/graphql/mutation/tweet';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import CenterDialog from './CenterDialog';

const DeletePostContainer = ({setDeleteDialog,postId:id,ref,setPostControlDialogOpen}:{setDeleteDialog:any,postId:string,ref?:any,setPostControlDialogOpen:any}) => {
 const queryClient=useQueryClient()
  const mutation = useMutation({
    mutationFn: deleteTweetMutate,
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({
        queryKey: ["all-tweet"],
      });
      setDeleteDialog(false);
      queryClient.refetchQueries({ queryKey: ["all-tweet"] });
    },
  });
  const handleDeletePost = async () => {
    if (!id) {
      return;
    }
    const body = {
      tweetId: id,
    };
    try {
      await mutation.mutateAsync(body);
      setDeleteDialog(false);
      setPostControlDialogOpen(false)
    } catch (error) {
      console.log(error);
    }
  };

  const title="delete post?"
  const content="This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results."
  const actionBtn={
    name:"delete",
    action:handleDeletePost

  }
  const setCloseDialog=setDeleteDialog
  return (
    <div>
      <CenterDialog
      title={title}
      content={content}
      actionBtn={actionBtn}
      setCloseDialog={setCloseDialog}
      />
    </div>
  )
}

export default DeletePostContainer