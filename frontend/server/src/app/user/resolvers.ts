import { prismaClient } from "../../client/db";
import JWTService from "../../services/jwt";
import { checkHashedPassword, hashPassword } from "../../utils/hashPassword";
import { sendOtp } from "../../utils/nodemailer";
import { redis } from "../../utils/redis/redis";


interface getCredAndSendOtpPayload{
    firstName:string;
    lastName?:string;
    dateOfBirth?:string;
    email:string;

}

interface verifyOtpPayload{
    email:string;
    otp:string;
}

interface createAccountPayload{
    email:string;
    password:string;
}

const mutations={

     getCredAndSendOtp:async(parent:any,{payload}:{payload:getCredAndSendOtpPayload},ctx:any)=>{
       console.log(payload,"payload")
        const {firstName,lastName,dateOfBirth,email}=payload

        if(!firstName||!email){
            throw new Error("Please provide required credentials")
        }
        try{
            const user=await prismaClient.user.findUnique({where:{email:email}})
            if(user){
                throw new Error("User already exist.Please login")
            }
        }
        catch(error){
            console.log(error)
        }
       
        const data={
            email,firstName,lastName,dateOfBirth
        }
        const expiryTime=60*60*24

       await  redis.set(`unverifiedUser:${email}`,JSON.stringify(data),"EX",expiryTime)
       const oldData=await redis.get(`unverifiedUser:${email}`)
       console.log(oldData,"oldata")



       const otpsend=await sendOtp(email)

       console.log(otpsend)

       return {email}




       
        
        

    },
    verifyOtp:async(parent:any,{payload}:{payload:verifyOtpPayload},ctx:any)=>{
         
        const{email,otp}=payload

        if(!email||!otp){
            throw new Error("Please provide required creds")
        }
        const user=await prismaClient.user.findUnique({where:{email:email}})
        if(user){
            throw new Error("User already exist.Please login")
        }
        const storedOtp=await redis.get(`Otp/:${email}`)

        if(!storedOtp){
            throw new Error("No otp or otp expired.Please request again for the otp to verify the account.")
        }
        const storedOtpCred=JSON.parse(storedOtp)
        console.log(otp,"otp"," ","stored otp",storedOtpCred.otp)
        if(storedOtpCred.otp!==Number(otp)){
            throw new Error("Invalid otp!Please enter correct otp.")
        }
        const oldData=await redis.get(`unverifiedUser:${email}`)
        console.log(oldData,"old data")
        if(!oldData){
            throw new Error("error occured .Please again enter your creds.")
        }
        const newData=JSON.stringify({...JSON.parse(oldData),verified:true})
        await redis.set(`verifiedUser:${email}`,newData)
           return {email}
        


    },
    createAccount:async(parent:any,{payload}:{payload:createAccountPayload},ctx:any)=>{
        const {email,password}=payload

        if(!email||!password){
            throw new Error("Please provide required creds")
        }

        const getVerifiedUser=await redis.get(`verifiedUser:${email}`)
        if(!getVerifiedUser){
            throw new Error("No user present.Please verify your account first.")
        }

        const parsedVerifiedUser=JSON.parse(getVerifiedUser)

        const user=await prismaClient.user.findUnique({where:{email}})
        if(user){
            throw new Error("User already exist.Please login")
        }
        let userName

         const existingUserName=await prismaClient.user.findUnique({where:{userName:`@${parsedVerifiedUser.lastName??"_"}${parsedVerifiedUser.firstName}`}})
        if(existingUserName){
            if(parsedVerifiedUser.dateOfBirth){
                userName=`@${existingUserName}${parsedVerifiedUser.dateOfBirth}`

            }
            else{
           userName=`@${existingUserName}${Math.floor(Math.random()*20)}`

            }
        }
        else{
             userName=`@${parsedVerifiedUser.lastName??"_"}${parsedVerifiedUser.firstName}`
        }
        const hashedPassword=await hashPassword(password)
       
        const newUser=await prismaClient.user.create({
            data:{
                email:email,
                firstName:parsedVerifiedUser.firstName,
                lastName:parsedVerifiedUser.lastName??"",
                userName:userName!,
                dateOfBirth:parsedVerifiedUser.dateOfBirth??"" ,
                password:hashedPassword  

            }
        })
        

        const token=await JWTService.generateTokenFromUser(newUser)
        console.log(token,"token")
        return {token}


    },
    resendOtp:async(parent:any,{payload}:{payload:{email:string},ctx:any})=>{

        const {email}=payload
        if(!email){
            throw new Error("Provide required credentials.")
        }
        const sentotp=await sendOtp(email)
        console.log(sentotp)
        return {email}
    },
    getLoginCreds:async(parent:any,{payload}:{payload:{email:string}},ctx:any)=>{
         const {email}=payload
         if(!email){
            throw new Error("provide required credentials.")
         }
         const user=await prismaClient.user.findUnique({where:{email}})


         if(!user){
         const queryByUserName=await prismaClient.user.findUnique({where:{userName:email}})
         if(!queryByUserName){
            throw new Error("account doesnot exist")

         }
        
         return {email:queryByUserName.email}
         }
         return {email}
         
    },
    checkLoginPassword:async(parent:any,{payload}:{payload:{email:string,password:string}},ctx:any)=>{
        const {email,password}=payload
        if(!email||!password){
            throw new Error("Please provide required credentials")
        }
        const user=await prismaClient.user.findUnique({where:{email}})
        
        if(!user){
            throw new Error("account doesnot exist")
       
         }

         if(!user.password){
            throw new Error("password is not set please set password first.")
         }

         const verifyPassword=await checkHashedPassword(password,user.password)

         if(!verifyPassword){
            throw new Error("Password is invalid.PLease try again.")
         }

         const token=await JWTService.generateTokenFromUser

         return {token}

         
        }

        
    }

    


export const resolvers={mutations}