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
  authType: string;
}

export interface checkLoginPassProps {
  email: string;
  password: string;
}
export interface editProfileProps {
  firstName: string;
  lastName?: string;
  profileImgUrl: string;
  coverImgUrl?: string;
  bio?: string;
  location?: string;
}

export interface getCurrentUserQueryProps {
  getCurrentUser: getCurrentUser;
}

export interface authorType extends getCurrentUser {}
export interface getCurrentUser {
  firstName: string;
  lastName: string;
  email: string;
  profileImgUrl: string;
  userName: string;
  id: string;
  bio: string;
  coverImgUrl: string;
  location: string;
  tweet: Tweet[];
  likedTweets: Like[];
  commentTweets: Comment[];
  posts: Tweet[];
  followers: follow[];
  followingList: follow[];
}

export interface createTweetMutateProps {
  content: string;
  mediaArray: string[];
}

export interface Tweet {
  id: string;
  content: string;
  author: getCurrentUser;
  likedBy: Like[];
  commentAuthor: Comment[];
  authorId: string;
  savedPost: Bookmarks[];
  mediaArray: string[];
  repostTweet: Repost[];
  hashtags: HashTag[];
  createdAt: string;
  updatedAt: string;
}

export interface HashTag {
  id: string;
  text: string;
  tweets: Tweet[];
}

interface getAllTweet {
  getAllTweet: Tweet[];
}

export interface GetAllTweetProps {
  getAllTweet: Tweet[];
}
export interface GetUserFollowingTweetProps {
  getUserFollowingTweet: Tweet[];
}
export interface getAllHashTagsProps {
  getAllHashTags: HashTag[];
}

export interface getAllTrending {
  trendingHashtag: HashTag[];
  trendingTweet: Tweet[];
  trendingUser: getCurrentUser[];
}

export interface getAllTrendingProps {
  getAllTrending: getAllTrending;
}
export interface getForYouProps {
  getForYou: getForYou;
}
export interface getForYou {
  forYouHashtag: HashTag[];
  forYouTweet: Tweet[];
  forYouUser: getCurrentUser[];
}

export interface Bookmarks {
  id: string;
  userId: string;
  tweetId: string;
  commentId: string;
  user: getCurrentUser[];
  tweet: Tweet;
  comment: Comment;
}

export interface getAllBookmarksProps {
  getAllBookmarks: Bookmarks[];
}
export interface Like {
  id: string;
  userId: string;
  tweetId: string;
  user: getCurrentUser;
  tweet: Tweet;
  commentId: string;
  comment: Comment;
}

export interface toggleLikeTweetProps {
  tweetId: string;
  commentId?: string;
}

export interface CreateCommentProps {
  content: string;
  tweetId: string;
  mediaArray: string[];
}

export interface Comment {
  content: string;
  id: string;
  authorId: string;
  mediaArray: string[];
  tweetId: string;
  tweet: Tweet[];
  author: getCurrentUser;
  likes: Like[];
  replies: Comment[];
  parentId: string;
  parent: Comment;
  repostComment: Repost[];
  hashtags: HashTag[];
  createdAt: string;
  savedPost: Comment[];
}

export interface getUserByUserNameProps {
  getUserByUserName: getCurrentUser;
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
  follower: {
    firstName: string;
    lastName: string;
  };
  following: {
    firstName: string;
    lastName: string;
  };
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

export interface Repost {
  id: string;
  userId: string;
  tweetId: string;
  commentId: string;
}

export interface searchQueryProps {
  getSearchByQuery: {
    people: getCurrentUser[];
    post: Tweet[];
    hashtag: HashTag[];
  };
}

export interface createTweetResult {
  author: getCurrentUser;
  id: string;
  content: string;
  mediaArray: string[];
}

export interface createCommentResult {
  id: string;
  content: string;
  authorId: string;
  tweetId: string;
}

export interface replyOnCommentResult {
  id: string;
  content: string;
  authorIdL: string;
}
