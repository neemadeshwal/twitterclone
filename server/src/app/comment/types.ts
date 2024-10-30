export const types = `#graphql

type Comment{
    id:String
    comment:String
    userId:String
    tweetId:String
    
}

input createCommentInput{
    comment:String
    tweetId:String
}
`;
