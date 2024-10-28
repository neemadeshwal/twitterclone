import { graphqlClient } from "@/clients/api";
import { gql, GraphQLClient } from "graphql-request";
import {
  checkLoginPassProps,
  createAccountProps,
  getCredsData,
  getLoginCredsProps,
  verifyOtpProps,
} from "../types";

const GET_CREDS_SENDOTP = gql`
  mutation GetCredsSendOTP($payload: getCredAndSendOtpInput!) {
    getCredAndSendOtp(payload: $payload) {
      next_page
      email
    }
  }
`;

const VERIFY_OTP = gql`
  mutation VerifyOtp($payload: verifyOtpInput!) {
    verifyOtp(payload: $payload) {
      email
      next_page
    }
  }
`;

const CREATE_ACCOUNT = gql`
  mutation createAccount($payload: createAccountInput!) {
    createAccount(payload: $payload) {
      next_page
      message
      token
    }
  }
`;

const GET_LOGIN_CREDS = gql`
  mutation getLoginCreds($payload: getLoginCredsInput!) {
    getLoginCreds(payload: $payload) {
      email
      next_page
    }
  }
`;
const CHECK_LOGIN_PASSWORD = gql`
  mutation checkLoginPassword($payload: checkLoginPasswordInput!) {
    checkLoginPassword(payload: $payload) {
      message
      next_page
      token
    }
  }
`;
export const getCredAndSendOtp = async (payload: getCredsData) => {
  console.log(payload, "payload in use");
  const data = await graphqlClient.request(GET_CREDS_SENDOTP, { payload });
  return data;
};

export const verifyOtp = async (payload: verifyOtpProps) => {
  console.log(payload);
  const data = await graphqlClient.request(VERIFY_OTP, { payload });
  return data;
};

export const createAccount = async (payload: createAccountProps) => {
  const data = await graphqlClient.request(CREATE_ACCOUNT, { payload });
  return data;
};

export const getLoginCreds = async (payload: getLoginCredsProps) => {
  const data = await graphqlClient.request(GET_LOGIN_CREDS, { payload });
  return data;
};

export const checkLoginPassword = async (payload: checkLoginPassProps) => {
  console.log(payload);
  const data = await graphqlClient.request(CHECK_LOGIN_PASSWORD, { payload });
  return data;
};
