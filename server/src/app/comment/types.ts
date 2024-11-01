export const types = `#graphql

type Comment{
    id:String
    comment:String
    userId:String
    tweetId:String
    user:User
    tweet:Tweet
    
}

input createCommentInput{
    comment:String
    tweetId:String
}
`;
