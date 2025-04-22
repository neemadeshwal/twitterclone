import { graphqlClient } from "@/clients/api";
import { gql } from "@apollo/client";


const REWRITE_TWEET_WITH_AI=gql`
mutation rewriteTweetWithAi($payload:rewriteTweetWithAiPayload){
    rewriteTweetWithAi(payload:$payload){
        output
    }
}
`

export const rewriteTweetWithAi=async(payload:{tweet:string,instructions:string})=>{
    const data=await graphqlClient.request(REWRITE_TWEET_WITH_AI,{
        payload
    })
    return data;
}