// hooks/useTweetMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTweetMutate, deleteTweetMutate} from "@/graphql/mutation/tweet";
import { createTweetMutateProps, toggleLikeTweetProps } from "@/graphql/types";
import {  toggleLikeTweet } from "@/graphql/mutation/like";
import { repostTweetMutate } from "@/graphql/mutation/repost";
import { toggleBookmarkTweet } from "@/graphql/mutation/bookmark";

interface UseTweetMutationProps {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export const useTweetMutation = ({ onSuccess, onError }: UseTweetMutationProps = {}) => {
  const queryClient = useQueryClient();

  const createTweetMutation = useMutation({
    mutationFn: (body: createTweetMutateProps) => createTweetMutate(body),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["all-tweet"] });
      queryClient.invalidateQueries({ 
        queryKey: ["single-tweet"]
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.log(error);
      onError?.(error);
    },
  });

  const likeTweetMutation=useMutation({
    mutationFn:(body:toggleLikeTweetProps)=>toggleLikeTweet(body),
    onSuccess:(response)=>{
      queryClient.invalidateQueries({queryKey:["all-tweet"]});
      queryClient.invalidateQueries({ 
        queryKey: ["single-tweet"]
      });
      onSuccess?.()
  },
  onError:(error)=>{
    console.log(error)
    onError?.(error)
  }
  })
  const repostTweetMutation=useMutation({
    mutationFn:(body:{tweetId:string})=>repostTweetMutate(body),
    onSuccess:(response)=>{
      queryClient.invalidateQueries({queryKey:["all-tweet"]});
      queryClient.invalidateQueries({ 
        queryKey: ["single-tweet"]
      });
    }
  })

  const saveTweetMutation=useMutation({
    mutationFn:(body:{tweetId:string})=>toggleBookmarkTweet(body),
    onSuccess:(response)=>{
      queryClient.invalidateQueries({queryKey:["all-tweet"]});
      queryClient.invalidateQueries({ 
        queryKey: ["single-tweet"]
      });
    }
  })
  const deleteTweetMutation=useMutation({
    mutationFn:(body:{tweetId:string})=>deleteTweetMutate(body),
    onSuccess:(response)=>{
      queryClient.invalidateQueries({queryKey:["all-tweet"]});
      queryClient.invalidateQueries({ 
        queryKey: ["single-tweet"]
      });
    }
  })

  const createTweet = async (body: createTweetMutateProps) => {
    try {
      await createTweetMutation.mutateAsync(body);
    } catch (error) {
      console.log(error);
    }
  };
  const likeTweet=async(body:toggleLikeTweetProps)=>{
    try{
     await likeTweetMutation.mutateAsync(body)
    }
    catch(error){
      console.log(error)
    }
  }
  const repostTweet=async(body:{tweetId:string})=>{
    try{
        await repostTweetMutation.mutateAsync(body)
    }
    catch(error){
      console.log(error)
    }
  }
  const saveTweet=async(body:{tweetId:string})=>{
    try{
      await saveTweetMutation.mutateAsync(body)

    }
    catch(error){
      console.log(error)
    }
  }
  const deleteTweet=async(body:{tweetId:string})=>{
    try{
      await deleteTweetMutation.mutateAsync(body)

    }
    catch(error){
      console.log(error)
    }
  }


  return { createTweet,likeTweet,repostTweet,deleteTweet,saveTweet,isDeletingTweet:deleteTweetMutation.isPending,isRepostingTweet:repostTweetMutation.isPending,isCreatingTweet:createTweetMutation.isPending,isLikingTweet:likeTweetMutation.isPending };
};