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
            comment
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
            LikedBy{
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
