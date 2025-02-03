export const types = `#graphql

scalar DateTime

type Tweet{
    content:String
    id:String
    authorId:String
    author:User
    mediaArray:[String]
    LikedBy:[Like]
    commentAuthor:[Comment]
    repostTweet:[Repost]
    hashtags:[HashTag]
    savedPost:[savedPost]
    createdAt:DateTime
    updatedAt:DateTime
    



}
type HashTag{
    id:String
    text:String
    tweets:[Tweet]
}

input DeleteTweetInput{
    tweetId:String
}

input CreateTweetInput{
    content:String!
    mediaArray:[String]
    
}
input SingleTweetInput{
    id:String
}

input EditTweetInput{
    content:String
    mediaArray:[String]
    tweetId:String
}

`;
