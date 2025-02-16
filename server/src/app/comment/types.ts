export const types = `#graphql

type Comment{
    id:String
    content:String
    mediaArray:[String]
    authorId:String
    tweetId:String
    author:User
    tweet:Tweet
    likes:[Like]
    parent:Comment
    replies:[Comment]
    parentId:String
    repostComment:[Repost]
    createdAt:DateTime
    updatedAt:DateTime
    savedPost:[savedPost]
    

    
}

input createCommentInput{
    content:String
    tweetId:String
    mediaArray:[String]
}
input replyOnCommentInput{
    content:String
    commentId:String
    mediaArray:[String]

    
}
input getCommentByIdInput{
    commentId:String
}


`;
