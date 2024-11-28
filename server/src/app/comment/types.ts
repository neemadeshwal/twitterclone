export const types = `#graphql

type Comment{
    id:String
    comment:String
    mediaArray:[String]
    userId:String
    tweetId:String
    user:User
    tweet:Tweet
    likes:[Like]
    parent:Comment
    replies:[Comment]
    parentId:String
    repostComment:[Repost]
    saveComment:[savedPost]

    
}

input createCommentInput{
    comment:String
    tweetId:String
    mediaArray:[String]
}
input replyOnCommentInput{
    comment:String
    commentId:String
    mediaArray:[String]

    
}
input getCommentByIdInput{
    commentId:String
}


`;
