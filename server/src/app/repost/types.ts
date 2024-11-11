export const types = `#graphql

input repostCommentInput{
    commentId:String
}

input repostTweetInput{
    tweetId:String
}

type Repost{
    id:String
    userId:String
    tweetId:String
    commentId:String
    comment:Comment
    tweet:Tweet
    user:User

}
`;
