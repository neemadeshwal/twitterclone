import { gql } from "@apollo/client";

export const getSearchByQuery = gql`
  query getSearchByQuery($payload: searchQueryInput) {
    searchQuery(payload: $payload) {
      people {
        id
        userName
        firstName
        lastName
        profileImgUrl
      }
      hashtag {
        id
        text
        tweets {
          id
          content
          photoArray
          videoArray
          hashtags {
            id
            text
            tweets {
              id
            }
          }
          repostTweet {
            userId
            tweetId
            id
            tweet {
              id
              content
              photoArray
              videoArray
              author {
                id
                userName
                email
                firstName
                lastName
              }
            }
          }
          commentAuthor {
            id
            comment
            userId
            tweetId
          }
          author {
            firstName
            lastName
            userName
            profileImgUrl
            id
          }
          LikedBy {
            id
            userId
            tweetId
            tweet {
              id
              content
            }
            user {
              firstName
              email
              id
            }
          }
        }
      }
      post {
        id
        content
        photoArray
        videoArray
        hashtags {
          id
          text
          tweets {
            id
          }
        }
        repostTweet {
          userId
          tweetId
          id
          tweet {
            id
            content
            photoArray
            videoArray
            author {
              id
              userName
              email
              firstName
              lastName
            }
          }
        }
        commentAuthor {
          id
          comment
          userId
          tweetId
        }
        author {
          firstName
          lastName
          userName
          profileImgUrl
          id
        }
        LikedBy {
          id
          userId
          tweetId
          tweet {
            id
            content
          }
          user {
            firstName
            email
            id
          }
        }
      }
    }
  }
`;
