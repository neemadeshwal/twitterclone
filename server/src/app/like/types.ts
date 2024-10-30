export const types = `#graphql

input toggleLikeTweetInput{
    tweetId:String
}

type Like{
    id:String
    userId:String
    tweetId:String
    user:User
    tweet:Tweet
}
`;
