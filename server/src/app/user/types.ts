export const types = `#graphql



type getCredAndSendOtpType{
email:String
next_page:String
}
type resendOtp{
    email:String
next_page:String

}
type createAccount{
    token:String
next_page:String
message:String

}
type verifyOtp{
    email:String
next_page:String

}
type getLoginCreds{
    email:String
next_page:String

}
type checkLoginPassword{
    token:String
next_page:String
message:String


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
`;
