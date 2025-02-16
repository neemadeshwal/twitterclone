import { gql } from "@apollo/client";

export const getAllTweetQuery = gql(`
        query GetAllTweet{
            getAllTweet{
            id 
            content
            mediaArray
            createdAt
            updatedAt
            savedPost{
                id
                userId
                tweetId
            }
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
            commentAuthor{
                    id
                    content
                    authorId
                    tweetId
                }
            author{
                firstName
                lastName
                userName
                profileImgUrl
                id
            }
            likedBy{
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
            mediaArray
            createdAt
            savedPost{
                id
                userId
                tweetId
            }
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
            
            
            commentAuthor{
                    id
                    content
                    authorId
                    tweetId
                    parentId
                    savedPost{
                        id
                        commentId
                    }
                    replies{
                        content
                        authorId
                        id
                        parent{
                            content
                            id
                        }
                        parentId
                    }
                    parent{
                        content
                        id
                        authorId
                        likes{
                            userId
                            id
                        }
                        author{
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
                    author{
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
            likedBy{
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

export const getUserFollowingTweet=gql(`
 query GetUserFollowingTweet{
            getUserFollowingTweet{
            id 
            content
            mediaArray
            createdAt
            updatedAt
            savedPost{
                id
                userId
                tweetId
            }
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
            commentAuthor{
                    id
                    content
                    authorId
                    tweetId
                }
            author{
                firstName
                lastName
                userName
                profileImgUrl
                id
            }
            likedBy{
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
    `)

export const getAllTrendingQuery=gql(`
    query getAllTrending{
        getAllTrending{
            trendingHashtag{
                id,
                tweets{
                    id
                    content
                }
                text
            },

            trendingTweet{
                id,
                content,
                createdAt,
                mediaArray
                author{
                    id
                        firstName
                        lastName
                        userName
                        profileImgUrl
                }

                likedBy{
                    id
                   

                    user{
                        id
                        firstName
                        lastName
                        userName
                        profileImgUrl

                    }
                }
            },
            trendingUser{
                id,
                firstName,
                lastName,
                userName,
                bio,
                profileImgUrl
                followers{
                    followerId
                }
            }
            
        },
        
    }
    `)    

export const getForYouQuery=gql(`
    query getForYou{
        getForYou{
         forYouHashtag{
                id,
                tweets{
                    id
                    content
                }
                text
            },

            forYouTweet{
                id,
                content,
                createdAt,
                mediaArray
                hashtags{
                    id
                    text
                }
                author{
                    id
                        firstName
                        lastName
                        userName
                        profileImgUrl
                }

                likedBy{
                    id
                   

                    user{
                        id
                        firstName
                        lastName
                        userName
                        profileImgUrl

                    }
                }
            },
            forYouUser{
                id,
                firstName,
                lastName,
                userName,
                bio,
                profileImgUrl
                followers{
                    followerId
                }
            }
            
        },
        
    }
    `)  