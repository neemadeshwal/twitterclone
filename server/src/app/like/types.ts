export const types = `#graphql

input toggleLikeTweetInput{
    tweetId:String
}

input toggleLikeCommentInput{
    commentId:String
}

type Like{
    id:String
    userId:String
    tweetId:String
    user:User
    tweet:Tweet
    comment:Comment
    commentId:String
    
}
`;
