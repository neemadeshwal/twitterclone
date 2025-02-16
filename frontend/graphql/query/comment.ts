import { gql } from "@apollo/client";

export const getCommentByIdQuery = gql`
  query getCommentById($payload: getCommentByIdInput) {
    getCommentById(payload: $payload) {
      id
      content
      mediaArray
      tweetId
      authorId
      parentId
      createdAt
      updatedAt
      
      # SavedPost relation
      savedPost {
        id
        commentId
        userId
      }
      
      # Repost relation
      repostComment {
        id
        userId
        commentId
      }
      
      # Tweet relation
      tweet {
        id
      }
      
      # Likes relation
      likes {
        id
        userId
      }
      
      # Author relation
      author {
        id
        firstName
        lastName
        userName
        email
        profileImgUrl
      }
      
      # Replies with nested structure
      replies {
        id
        content
        mediaArray
        createdAt
        
        # Nested savedPost
        savedPost {
          id
          commentId
          userId
        }
        
        # Nested likes
        likes {
          id
          userId
        }
        
        # Nested author (was previously 'user')
        author {
          id
          firstName
          lastName
          userName
          email
          profileImgUrl
        }
        
        # Nested parent
        parent {
          id
          content
          mediaArray
          
          # Parent's author
          author {
            id
            firstName
            lastName
            userName
            email
            profileImgUrl
          }
        }
        
        # Nested replies (second level)
        replies {
          id
          content
          mediaArray
          
          # Second level likes
          likes {
            id
            userId
          }
          
          # Second level author
          author {
            id
            firstName
            lastName
            userName
            email
            profileImgUrl
          }
          
          # Second level parent
          parent {
            id
            content
            mediaArray
            
            # Parent's author
            author {
              id
              firstName
              lastName
              userName
              email
              profileImgUrl
            }
          }
        }
      }
      
      # Parent comment
      parent {
        id
        content
        mediaArray
        
        # Parent's author
        author {
          id
          firstName
          lastName
          userName
          email
          profileImgUrl
        }
        
        # Parent's parent
        parent {
          id
          content
          mediaArray
          
          # Parent's parent's author
          author {
            id
            firstName
            lastName
            userName
            email
            profileImgUrl
          }
        }
      }
    }
  }
`;