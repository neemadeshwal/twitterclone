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

export const getUserByIdQuery = gql(`
  query GetUserById($payload:GetUserByIdInput!){
    getUserById(payload:$payload){
      email
    firstName
    lastName
    id
    profileImgUrl
    userName
    followers{
      followerId
      followingId
    }
    following{
      followerId
      followingId
    }
    posts {
      authorId
      content
      commentAuthor{
                id
                comment
                userId
                tweetId
                user{
                  profileImgUrl
                  firstName
                  lastName
                  userName
                  email
                  id
                }
                
            }
      id
      photoArray
      videoArray
      author {
        email
        userName
        profileImgUrl
        firstName
        
      }
     LikedBy{
      id
      userId
    
     }
      
    }
    commentTweets {
      comment
      id
      userId
      tweetId
      user{
        firstName
        userName
        lastName
        email
        id
        profileImgUrl
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
          user{
            firstName
            userName
          }
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

export const getAllUsersQuery = gql(`
  query GetAllUsers{
    getAllUsers{
      id
      firstName
      lastName
      profileImgUrl
      userName
      followers{
       followerId
       
        
      }
      following{
        followingId
        followerId
      }
    }
  }
    `);
