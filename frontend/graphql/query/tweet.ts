import { gql } from "@apollo/client";

export const getAllTweetQuery = gql(`
    query GetAllTweet{
        getAllTweet{
         id 
         content
         commentAuthor{
                id
                comment
                userId
                tweetId
            }
         author{
            firstName
            lastName
            userName
            profileImgUrl
         }
         LikedBy{
            id
            userId
            tweetId
            tweet{
                id
                content

            }
            user{
                firstName
                email
                id
                
            }
          
         }
        }
    }
`);
