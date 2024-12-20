export const types = `#graphql


type Tweet{
    content:String
    id:String
    authorId:String
    author:User
    photoArray:[String]
    videoArray:[String]
    LikedBy:[Like]
    commentAuthor:[Comment]
    repostTweet:[Repost]
    hashtags:[HashTag]
    savedPost:[savedPost]



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
    photoArray:[String]
    videoArray:[String]
    
}
input SingleTweetInput{
    id:String
}

`;
