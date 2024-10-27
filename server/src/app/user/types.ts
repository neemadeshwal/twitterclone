


export const types=`#graphql



type getCredAndSendOtpType{
email:String
}
type resendOtp{
    email:String
}
type createAccount{
    token:String
}
type verifyOtp{
    email:String
}
type getLoginCreds{
    email:String
}
type checkLoginPassword{
    token:String
}
input getCredAndSendOtpInput{
    email:String
    firstName:String
    lastName:String
    dateOfBirth:String
}

input verifyOtpInput{
    email:String
    otp:String
}

input resendOtpInput{
    email:String
}
input createAccountInput{
    email:String
    password:String
}
input checkLoginPasswordInput{
    email:String
    password:String
}
input getLoginCredsInput{
    email:String
}
`