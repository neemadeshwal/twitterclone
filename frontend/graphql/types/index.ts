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
  id: string;
}
