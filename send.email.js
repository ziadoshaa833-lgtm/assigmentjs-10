import nodemailer from "nodemailer";
import { env } from "../../config/env.service.js";



const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:env.emailuser,
        pass:env.apppassword
    }
})

export const sendEmail=({to,subject,html})=>{
    transporter.sendMail({
    from:"sara7a@gmail.com",
    to,
    subject,
    html
})
console.log("email send");

 }