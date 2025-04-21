import { gql } from "@apollo/client";

export const getAllBookmarks = gql(`
query getAllBookmarks{
    getAllBookmarks{
        id
        tweetId
        commentId
        userId

        comment{
            id
            content
            createdAt

            mediaArray
            likes{
                userId
                id
            }
            tweet{
                id
            }
            author{
                id
                firstName
                lastName
                userName
                email
                profileImgUrl
            }
        }

        tweet{
            id
            content
            createdAt
            author{
                firstName
                lastName
                userName
                profileImgUrl
                id
            }
            likedBy{
                id
            }
            commentAuthor{
                id
            }
            repostTweet{
                id
            }
        }

    }
}
    `);
