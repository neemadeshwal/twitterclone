export const types = `#graphql

type Follows{
    followerId:String
    followingId:String
    follower:User
    following:User
}

input followUserPayload{
    userToFollowId:String
}

input unfollowUserPayload{
    userToUnfollowId:String
}
`;
