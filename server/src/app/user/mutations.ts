export const mutations = `#graphql

getCredAndSendOtp(payload:getCredAndSendOtpInput!):getCredAndSendOtpType
verifyOtp(payload:verifyOtpInput!):verifyOtp
createAccount(payload:createAccountInput!):createAccount
resendOtp(payload:resendOtpInput!):resendOtp
getLoginCreds(payload:getLoginCredsInput!):getLoginCreds
checkLoginPassword(payload:checkLoginPasswordInput!):checkLoginPassword
`;