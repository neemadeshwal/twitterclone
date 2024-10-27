import nodemailer from "nodemailer"
import { AUTH_EMAIL, AUTH_PASSWORD } from "../constants"
import { redis } from "../redis/redis"


const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:AUTH_EMAIL,
        pass:AUTH_PASSWORD
    }
})

export function genOtp(){
    const randomOtp=Math.floor(Math.random()*1000000)
    console.log(randomOtp)
    return randomOtp
}




export async function sendOtp(email:string) {
     const otp=genOtp()
    const mailOptions={

        from:AUTH_EMAIL,
        to:email,
        subject:"Verify your account.",
           html: `<p>Your OTP code is: <strong>${otp}</strong></p>`
    }
    try{
        const info=await transporter.sendMail(mailOptions)
        console.log("Otp send successfully",info.messageId)
        const expiryTime=60*60*5;
        await  redis.set(`Otp/:${email}`,JSON.stringify({email,otp}),"EX",expiryTime)

        


    }
    catch(error){
        console.log("An error occured.",error)
    }

    
    
}