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
      media {
        id
        mediaArray
      }
      hashtag {
        id
        text
        tweets {
          createdAt
          hashtags {
            id
            text
          }
          likedBy {
            id
          }
          commentAuthor {
            id
          }
          id
          content
          mediaArray
          author {
            id
            userName
            email
            firstName
            lastName
          }
          repostTweet {
            userId
            tweetId
            id
            tweet {
              id
              content
              mediaArray
              author {
                id
                userName
                email
                firstName
                lastName
              }
            }
          }
        }
      }
      latest {
        id
        content
        mediaArray
        createdAt
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
            mediaArray
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
          content
          authorId
          tweetId
        }
        author {
          firstName
          lastName
          userName
          profileImgUrl
          id
        }
        likedBy {
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
      post {
        id
        content
        mediaArray
        createdAt
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
            mediaArray
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
          content
          authorId
          tweetId
        }
        author {
          firstName
          lastName
          userName
          profileImgUrl
          id
        }
        likedBy {
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
