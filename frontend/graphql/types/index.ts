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

interface getCurrentUser {
  firstName: string;
  lastName: string;
  email: string;
  profileImgUrl: string;
  userName: string;
  id: string;
}

export interface createTweetMutateProps {
  content: string;
}
export interface Tweet {
  id: string;
  content: string;
  author: getCurrentUser;
}

interface getAllTweet {
  getAllTweet: Tweet[];
}

export interface GetAllTweetProps {
  getAllTweet: Tweet[];
}
