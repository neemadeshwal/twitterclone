export interface getCredsData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
}

export interface verifyOtpProps {
  email: string;
  otp: string;
}
export interface createAccountProps {
  password: string;
  email: string;
}

export interface getLoginCredsProps {
  email: string;
}

export interface checkLoginPassProps {
  email: string;
  password: string;
}

export interface getCurrentUserQueryProps {
  getCurrentUser: getCurrentUser;
}

export interface getCurrentUser {
  firstName: string;
  lastName: string;
  email: string;
  profileImgUrl: string;
  userName: string;
  id: string;
  bio: string;
  coverImgUrl: string;
  tweet: Tweet[];
  likedTweets: Like[];
  commentTweets: Comment[];
  posts: Tweet[];
  followers: follow[];
  following: follow[];
}

export interface createTweetMutateProps {
  content: string;
  photoArray: string[];
  videoArray: string[];
}
export interface Tweet {
  id: string;
  content: string;
  author: getCurrentUser;
  LikedBy: Like[];
  commentAuthor: Comment[];
  authorId: string;
  photoArray: string[];
  videoArray: string[];
}

interface getAllTweet {
  getAllTweet: Tweet[];
}

export interface GetAllTweetProps {
  getAllTweet: Tweet[];
}
export interface Like {
  id: string;
  userId: string;
  tweetId: string;
  user: getCurrentUser;
  tweet: Tweet;
}

export interface toggleLikeTweetProps {
  tweetId: string;
  commentId?: string;
}

export interface CreateCommentProps {
  comment: string;
  tweetId: string;
  mediaArray: string[];
}

export interface Comment {
  comment: string;
  id: string;
  userId: string;
  mediaArray: string[];
  tweetId: string;
  tweet: Tweet[];
  user: getCurrentUser;
  likes: Like[];
  replies: Comment[];
  parentId: string;
  parent: Comment;
}

export interface getUserByIdProps {
  getUserById: getCurrentUser;
}

export interface getSingleTweetProps {
  getSingleTweet: Tweet;
}

export interface getAllUsersQueryProps {
  getAllUsers: getCurrentUser[];
}

export interface follow {
  followingId: string;
  followerId: string;
}

export interface followUserProps {
  userToFollowId: string;
}

export interface unfollowUserProps {
  userToUnfollowId: string;
}

export interface GetSingleCommentProps {
  getCommentById: Comment;
}
