import { gql } from "@apollo/client";

export const getCurrentUserQuery = gql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      firstName
      lastName
      profileImgUrl
      userName
    }
  }
`);

export const getUserByIdQuery = (id: string) =>
  gql(`
  query GetUserById($id:){
    getUserById(payload:{id:$id}){
      email
    firstName
    lastName
    id
    profileImgUrl
    userName
    posts {
      authorId
      author {
        email
        
      }
    }
    commentTweets {
      comment
      id
      userId
      tweetId
      user {
        email
      }
      tweet {
        content
      }
    }
    likedTweets {
      id
      tweetId
      tweet {
        author {
          firstName
          id
          email
        }
        authorId
        commentAuthor {
          tweetId
          id
          comment
        }
        content
        id
        LikedBy {
          tweet {
            authorId
          }
          tweetId
          userId
          id
        }
      }
    }
  
      

    }
  }`);
