import { gql } from "@apollo/client";

export const getAllTweetQuery = gql(`
    query GetAllTweet{
        getAllTweet{
         id 
         content
         author{
            firstName
            lastName
            userName
            profileImgUrl
         }
        }
    }
`);
