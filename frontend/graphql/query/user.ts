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
      coverImgUrl 
      location
      bio
      followers{
      followerId
      followingId
      follower{
        firstName
        lastName
        profileImgUrl
      }
    }
    followingList{
      followerId
      followingId
      follower{
        firstName
        lastName
        profileImgUrl
      }
      following{
        firstName
        lastName
        profileImgUrl
      }
    }
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
    coverImgUrl
    location
    bio
    profileImgUrl
    userName
    followers{
      followerId
      followingId
      follower{
        firstName
        lastName
        profileImgUrl
      }
    }
    followingList{
      followerId
      followingId
      follower{
        firstName
        lastName
        profileImgUrl
      }
    }
    
    posts {
      authorId
      repostTweet{
                userId
                tweetId
                id
                tweet{
                    id
                    content
                   mediaArray
                    author{
                        id
                        userName
                        email
                        firstName
                        lastName
                    }
                }
            }
      content
      commentAuthor{
                id
                content
                authorId
                tweetId
                author{
                  profileImgUrl
                  firstName
                  lastName
                  userName
                  email
                  id
                }
                parent{
                  content
                  mediaArray
                  author{
                    id
                    email
                    userName
                    firstName
                    lastName
                  }
                }
                parentId
                replies{
                  authorId
                  id
                  content
                  mediaArray
                  
                }
                
            }
      id
     mediaArray
      author {
        email
        userName
        profileImgUrl
        firstName
        
      }
     likedBy{
      id
      userId
    
     }
      
    }
    commentTweets {
      content
      id
      authorId
      tweetId
      author{
        firstName
        userName
        lastName
        email
        id
        profileImgUrl
      }
      
      tweet {
        content
        mediaArray
        repostTweet{
                userId
                tweetId
                id
                tweet{
                    id
                    content
                    mediaArray
                    author{
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
        repostTweet{
                userId
                tweetId
                id
                tweet{
                    id
                    content
                   mediaArray
                    author{
                        id
                        userName
                        email
                        firstName
                        lastName
                    }
                }
            }
            
        commentAuthor {
          tweetId
          id
          content
          author{
            firstName
            userName
          }
        }
        content
        id
       mediaArray
        likedBy {
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
      followingList{
        followingId
        followerId
      }
    }
  }
    `);
