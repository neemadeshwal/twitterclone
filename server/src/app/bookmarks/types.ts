export const types = `#graphql

type savedPost{
    id:String 
  userId:String
  user:User
  tweetId:String
  tweet:Tweet
  commentId:String
  comment:Comment
}

input saveUnsaveCommentInput{
    commentId:String
}
input toggleSaveTweetInput{
    tweetId:String
}

`;
