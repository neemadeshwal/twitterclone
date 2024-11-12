import { gql } from "@apollo/client";

export const getAllTweetQuery = gql(`
        query GetAllTweet{
            getAllTweet{
            id 
            content
            photoArray
            videoArray
            hashtags{
                id 
                text
                tweets{
                    id
                }
            }
            repostTweet{
                userId
                tweetId
                id
                tweet{
                    id
                    content
                    photoArray
                    videoArray
                    author{
                        id
                        userName
                        email
                        firstName
                        lastName
                    }
                }
            }
            commentAuthor{
                    id
                    comment
                    userId
                    tweetId
                }
            author{
                firstName
                lastName
                userName
                profileImgUrl
                id
            }
            LikedBy{
                id
                userId
                tweetId
                tweet{
                    id
                    content

                }
                user{
                    firstName
                    email
                    id
                    
                }
            
            }
            }
        }
    `);

export const getSingleTweetQuery = gql(`
        query getSingleTweet($payload:SingleTweetInput!){
            getSingleTweet(payload:$payload){
                
                id 
            content
            photoArray
            videoArray
            hashtags{
                id 
                text
                tweets{
                    id
                }
            }
            repostTweet{
                userId
                tweetId
                id
                tweet{
                    id
                    content
                    photoArray
                    videoArray
                    author{
                        id
                        userName
                        email
                        firstName
                        lastName
                    }
                }
            }
            
            
            commentAuthor{
                    id
                    comment
                    userId
                    tweetId
                    parentId
                    replies{
                        comment
                        userId
                        id
                        parent{
                            comment
                            id
                        }
                        parentId
                    }
                    parent{
                        comment
                        id
                        userId
                        likes{
                            userId
                            id
                        }
                        user{
                            id
                            firstName
                            lastName
                            email
                            userName
                            profileImgUrl
                        }
                    }
                    likes{
                        id
                        userId
                        tweetId
                    }
                    user{
                        id
                        firstName
                        lastName
                        userName 
                        profileImgUrl
                    }
                }
            author{
                firstName
                lastName
                userName
                profileImgUrl
                id
            }
            LikedBy{
                id
                userId
                tweetId

                tweet{
                    id
                    content

                }
                user{
                    firstName
                    email
                    id
                    
                }
            
            }
            

            }
        }`);

export const allHashTagQuery = gql(`
    query allHashtag{
        getAllHashTags{
            id
            text
        }
    }
    
    `);
