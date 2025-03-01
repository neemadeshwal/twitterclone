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
            mediaArray
            likes{
                userId
                id
            }
            tweet{
                id
            }
            user{
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
