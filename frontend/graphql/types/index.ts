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
  tweet: Tweet[];
  likedTweets: Like[];
  commentTweets: Comment[];
}

export interface createTweetMutateProps {
  content: string;
}
export interface Tweet {
  id: string;
  content: string;
  author: getCurrentUser;
  LikedBy: Like[];
  commentAuthor: Comment[];
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
}

export interface CreateCommentProps {
  comment: string;
  tweetId: string;
}

export interface Comment {
  comment: string;
  id: string;
  userId: string;
  tweetId: string;
}

export interface getUserByIdProps {
  getUserById: getCurrentUser;
}
