export const types = `#graphql


type Tweet{
    content:String
    id:String
    authorId:String
    author:User
    LikedBy:[Like]
    commentAuthor:[Comment]

}


input CreateTweetInput{
    content:String!
    
}
input SingleTweetInput{
    id:String
}
`;
