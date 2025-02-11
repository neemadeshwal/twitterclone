import { User } from "@prisma/client";
import { prismaClient } from "../../client/db";
import { GraphqlContext } from "../../interfaces";
import JWTService from "../../services/jwt";
import { checkHashedPassword, hashPassword } from "../../utils/hashPassword";
import { sendOtp } from "../../utils/nodemailer";
import { redis } from "../../utils/redis/redis";
import { getRandomDarkHexColor } from "../../utils/getRandomColor";

interface getCredAndSendOtpPayload {
  firstName: string;
  lastName?: string;
  dateOfBirth?: string;
  email: string;
}

interface verifyOtpPayload {
  email: string;
  otp: string;
  authType:string;
}

interface createAccountPayload {
  email: string;
  password: string;
}
interface editProfileProps {
  firstName: string;
  lastName?: string;
  bio?: string;
  location?: string;
  profileImgUrl: string;
  coverImgUrl?: string;
}
const queries = {
  getCurrentUser: async (parent: any, payload: any, ctx: GraphqlContext) => {
    if (!ctx.user) {
      throw new Error("no token present.");
    }
    const user = await prismaClient.user.findUnique({
      where: { email: ctx.user.email },
    });

    if (!user) {
      throw new Error("user not exist.Please login first");
    }
    return user;
  },
  getUserById: async (
    parent: any,
    { payload }: { payload: { id: string } },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("no token present");
    }
    const { id } = payload;
    if (!id) {
      throw new Error("No id present");
    }

    const user = await prismaClient.user.findUnique({
      where: { id },
      include: { posts: true, likedTweets: true, commentTweets: true,followers:true },
    });
    if (!user) {
      throw new Error("No user present.");
    }

    return user;
  },
  getAllUsers: async (parent: any, payload: any, ctx: GraphqlContext) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.Please provide the token.");
    }
    const allUsers = await prismaClient.user.findMany({
      where: {
        NOT: {
          id: ctx.user.id,
        },
      },
    });
    return allUsers;
  },
};

const mutations = {
  getCredAndSendOtp: async (
    parent: any,
    { payload }: { payload: getCredAndSendOtpPayload },
    ctx: any
  ) => {
    const { firstName, lastName, dateOfBirth, email } = payload;

    if (!firstName || !email) {
      throw new Error("Please provide required credentials");
    }
    try {
      const user = await prismaClient.user.findUnique({
        where: { email: email },
      });
      if (user) {
        throw new Error("User already exist.Please login");
      }
    } catch (error) {
      console.log(error);
    }

    const data = {
      email,
      firstName,
      lastName,
      dateOfBirth,
    };
    const expiryTime = 60 * 60 * 24;

    await redis.set(
      `unverifiedUser:${email}`,
      JSON.stringify(data),
      "EX",
      expiryTime
    );
    const oldData = await redis.get(`unverifiedUser:${email}`);

    const otpsend = await sendOtp(email);

    return { email, next_page: "verifyotp" };
  },
  confirmedMail: async (
    parent: any,
    { payload }: { payload:{email:string} },
    ctx: any
  ) => {

   const{email}=payload;
    
      const user = await prismaClient.user.findUnique({
        where: { email: email },
      });
      if (!user) {
        throw new Error("User doesnot  exist.Please create account first");
      }
    

    const data = {
      email,
      firstName:user.firstName,
      lastName:user.lastName,
      dateOfBirth:user.dateOfBirth,
    };
    const expiryTime = 60 * 60 * 24;

    await redis.set(
      `unverifiedUser:${email}`,
      JSON.stringify(data),
      "EX",
      expiryTime
    );
    const oldData = await redis.get(`unverifiedUser:${email}`);

    const otpsend = await sendOtp(email);

    return { email, next_page: "verifyotp" };
  }
  
  ,
  verifyOtp: async (
    parent: any,
    { payload }: { payload: verifyOtpPayload },
    ctx: any
  ) => {
    const { email, otp,authType } = payload;

    if (!email || !otp) {
      throw new Error("Please provide required creds");
    }
    const user = await prismaClient.user.findUnique({
      where: { email: email },
    });
    if (user&&authType=="createaccount") {

      throw new Error("User already exist.Please login");
    }
    const storedOtp = await redis.get(`Otp/:${email}`);

    if (!storedOtp) {
      throw new Error(
        "No otp or otp expired.Please request again for the otp to verify the account."
      );
    }
    const storedOtpCred = JSON.parse(storedOtp);
    if (storedOtpCred.otp !== Number(otp)) {
      throw new Error("Invalid otp!Please enter correct otp.");
    }
    const oldData = await redis.get(`unverifiedUser:${email}`);
    if (!oldData) {
      throw new Error("error occured .Please again enter your creds.");
    }
    const newData = JSON.stringify({ ...JSON.parse(oldData), verified: true });
    await redis.set(`verifiedUser:${email}`, newData);
    const nextPage=authType=="forgotpass"?"newpass":"password"
    return { email, next_page: nextPage };
  },
  createAccount: async (
    parent: any,
    { payload }: { payload: createAccountPayload },
    ctx: any
  ) => {
    const { email, password } = payload;

    if (!email || !password) {
      throw new Error("Please provide required creds");
    }

    const getVerifiedUser = await redis.get(`verifiedUser:${email}`);
    if (!getVerifiedUser) {
      throw new Error("No user present.Please verify your account first.");
    }

    const parsedVerifiedUser = JSON.parse(getVerifiedUser);

    const user = await prismaClient.user.findUnique({ where: { email } });
    if (user) {
      throw new Error("User already exist.Please login");
    }
    let userName;

    const existingUserName = await prismaClient.user.findUnique({
      where: {
        userName: `${parsedVerifiedUser.lastName ?? "_"}${
          parsedVerifiedUser.firstName
        }`,
      },
    });
    if (existingUserName) {
      // if (parsedVerifiedUser.dateOfBirth) {
      //   userName = `${existingUserName.userName}${parsedVerifiedUser.dateOfBirth}`;
      // } else {
      userName = `${existingUserName.userName}${Math.floor(
        Math.random() * 20
      )}`;
      // }
    } else {
      userName = `${parsedVerifiedUser.lastName ?? "_"}${
        parsedVerifiedUser.firstName
      }`;
    }
    const hashedPassword = await hashPassword(password);

    const newUser = await prismaClient.user.create({
      data: {
        email: email,
        firstName: parsedVerifiedUser.firstName,
        lastName: parsedVerifiedUser.lastName ?? "",
        userName: userName!,
        dateOfBirth: parsedVerifiedUser.dateOfBirth ?? "",
        password: hashedPassword,
        profileImgUrl: getRandomDarkHexColor(),
      },
    });

    const token = await JWTService.generateTokenFromUser(newUser);
    return {
      token,
      message: "create account successful",
      next_page: "signin",
    };
  },
  resendOtp: async (
    parent: any,
    { payload }: { payload: { email: string }; ctx: any }
  ) => {
    const { email } = payload;
    if (!email) {
      throw new Error("Provide required credentials.");
    }
    const sentotp = await sendOtp(email);
    return { email, next_page: "verifyotp" };
  },
  getLoginCreds: async (
    parent: any,
    { payload }: { payload: { email: string,authType:string } },
    ctx: any
  ) => {
    const { email,authType } = payload;
    if (!email||!authType) {
      throw new Error("provide required credentials.");
    }
    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      const queryByUserName = await prismaClient.user.findUnique({
        where: { userName: email },
      });
      if (!queryByUserName) {
        throw new Error("account doesnot exist");
      }

      return { email: queryByUserName.email };
    }
    const nextPage=authType==="login"?"verifypassword":"confirmyou"
    return { email, next_page: nextPage };
  },
  checkLoginPassword: async (
    parent: any,
    { payload }: { payload: { email: string; password: string } },
    ctx: any
  ) => {
    const { email, password } = payload;
    if (!email || !password) {
      throw new Error("Please provide required credentials");
    }
    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("account doesnot exist");
    }

    if (!user.password) {
      throw new Error("password is not set please set password first.");
    }

    const verifyPassword = await checkHashedPassword(password, user.password);

    if (!verifyPassword) {
      throw new Error("Password is invalid.PLease try again.");
    }

    const token = await JWTService.generateTokenFromUser(user);

    return { token, message: "login successful", next_page: "signin" };
  },
  editProfile: async (
    parent: any,
    { payload }: { payload: editProfileProps },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) {
      throw new Error("Unauthorized.");
    }
    const user = await prismaClient.user.findUnique({
      where: {
        id: ctx.user.id,
      },
    });
    if (!user) {
      throw new Error("No user exist with this id.");
    }

    const { firstName, lastName, profileImgUrl, coverImgUrl, bio, location } =
      payload;
    if (!firstName || !profileImgUrl) {
      throw new Error("credential error.");
    }
    const edituser = await prismaClient.user.update({
      where: {
        id: ctx.user.id,
      },
      data: {
        firstName,
        lastName: lastName ?? user.lastName,
        profileImgUrl,
        coverImgUrl: coverImgUrl ?? user.coverImgUrl,
        bio: bio ?? user.bio,
        location: location ?? user.location,
      },
    });
    return edituser;
  },
  resetPassword:async(parent:any,{payload}:{payload:{email:string,password:string}},ctx:any)=>{

    const{email,password}=payload;
    console.log("passsword reseted succesfuly 1")

    if(!email||!password) throw new Error("No email password found.")


    const user=await prismaClient.user.findUnique({
      where:{email}
    })
  console.log("passsword reseted succesfuly 2")


    if(!user){
      throw new Error("No user found.")
    }
    const hashedPassword = await hashPassword(password);

    const resetUserPassword=await prismaClient.user.update({
      where:{email}
    ,
  
    data:{

      password:hashedPassword
    }
  })
  console.log("passsword reseted succesfuly 3")
  const token = await JWTService.generateTokenFromUser(resetUserPassword);
  return {
    token,
    message: "password reset successful",
    next_page: "signin",
  };
   
  }
};

const extraResolvers = {
  User: {
    posts: async (parent: User) => {
      if (!parent.id) {
        throw new Error("no id present");
      }
      const tweets = await prismaClient.tweet.findMany({
        where: { authorId: parent.id },
        include: {
          repostTweet: true,
        },
      });
      return tweets;
    },
    likedTweets: async (parent: User) => {
      const likedTweets = await prismaClient.like.findMany({
        where: { userId: parent.id },
        include: { user: true, tweet: true },
      });
      return likedTweets;
    },
    commentTweets: async (parent: User) => {
      const commentTweets = await prismaClient.comment.findMany({
        where: { userId: parent.id },
        include: { user: true, tweet: true },
      });
      return commentTweets;
    },
    followers: async (parent: User) => {
      const followedUsers = await prismaClient.follows.findMany({
        where: {
          followingId: parent.id,
        },
        include: { follower: true },
      });

      return followedUsers;
    },
    followingList: async (parent: User) => {
      const followingUsers = await prismaClient.follows.findMany({
        where: {
          followerId: parent.id,
        },
        include: {
          following: true,
        },
      });
      return followingUsers;
    },
  },
  Comment: {
    user: async (parent: { userId: string }) => {
      const user = await prismaClient.user.findUnique({
        where: { id: parent.userId },
      });
      return user;
    },
  },
};

export const resolvers = { mutations, queries, extraResolvers };
