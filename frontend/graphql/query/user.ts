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

export const getUserByUserNameQuery = gql(`
  query GetUserByUserName($payload:GetUserByUserNameInput!){
    getUserByUserName(payload:$payload){
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
      createdAt
      authorId
      savedPost{
        id
      }
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
      comment{
        author {
          firstName
          id
          userName
          lastName
          email
          profileImgUrl
        }
        authorId
        id
        content
        createdAt
      }
      commentId
      tweet {
        createdAt
        savedPost{
          id
        }
        author {
          firstName
          userName
          lastName
          id
          email
          profileImgUrl

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
