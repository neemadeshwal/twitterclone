import { editProfileMutate } from "@/graphql/mutation/user";
import { editProfileProps } from "@/graphql/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseUserMutationProps {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  }
  
export const userUserMutation=({onSuccess,onError}:UseUserMutationProps={})=>{
    const queryClient=useQueryClient()

    const EditUserMutation=useMutation({
        mutationFn:(body:editProfileProps)=>editProfileMutate(body),
        onSuccess:(response)=>{
            queryClient.invalidateQueries({queryKey:["user-detail"]})
        },
        onError: (error) => {
            console.log(error);
            onError?.(error);
          },
    })

    const editUser=async(body:editProfileProps)=>{
        try{
            await EditUserMutation.mutateAsync(body)

        }
        catch(error){
            console.log(error)
        }
        
    }

    return {editUser,isEditingUser:EditUserMutation.isPending}

}

