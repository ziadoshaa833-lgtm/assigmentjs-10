
import { BadRequestEception, ConflictException, NotFoundException } from "../../common/exciptions/error.exceptions.js"
import { sendEmail } from "../../common/middleware/send.email.js"
import { comparehash, genratehash } from "../../common/services/encrption.js"
import { generatenewAccesstoken, generatetoken } from "../../common/services/token.service.js"
import { userModel } from "../../database/model/user.model.js"
import jwt from "jsonwebtoken"
import { get, set } from "../../database/redis/redis.service.js"







export const signup = async (body,file) => {
    let { username, email, password, age, confirmpassword } = body
    let profileImage;
    if (password != confirmpassword) {
        return BadRequestEception({ message: "password and confiarmpassword not match" })
    }
    if(file){
        profileImage=file.path
    }
    let exsistedmail = await userModel.findOne({ email })
    if (exsistedmail) {
        return ConflictException({ message: "email already exits" })
    } else {
        let hashpassword = await genratehash({ plaintext: password })
        console.log(hashpassword);
        if (hashpassword) {
            let otp = Math.round(Math.random() * 100000)
            let user = await userModel.create({ username, email, password: hashpassword, age,  profileimage:profileImage})
              set(`otp::${user._id}`,otp,180)
              console.log(`otp::${user._id}`);
              
            sendEmail({ to: email, subject: "sign up", html: '<h1> your otp is ${otp} </h1>' })
            return ({ massage: "user Create", data: user })
        }
    }
}
export const login = async (body) => {
    let { email, password } = body
    let userdata = await userModel.findOne({ email })
    if (!userdata) {
        return NotFoundException({ message: "user not found" })
    }
    let Matched = await comparehash({ plaintext: password, hashedtext: userdata.password })
    if (Matched) {
        const { accesstoken, refreshtoken } = generatetoken(userdata)
        return ({ message: "login success", accesstoken, refreshtoken })
    } else {
        return BadRequestEception({ message: "password not match", extra: "token" })
    }
}
export const getalluser = async (id) => {
    let userdata = await userModel.findById(id)
    return userdata
}
export const generateaccesstoken = (body) => {
    let { refreshtoken } = body
    let { accesstoken } = generatenewAccesstoken(refreshtoken)
    if (accesstoken) {
        return { accesstoken }
    } else {
        throw BadRequestEception("invalud token")
    }

}
export const verfyAccount = async (body) => {
    let { email, otp } = body
    let userdata = await userModel.findOne({ email })
    if (!userdata) {
        throw NotFoundException({ message: "user not found" })
    }
    if (userdata.isverfied) {
        throw BadRequestEception({ message: "user already verfyed" })

    }
    let redisotp=get(`otp::${userdata._id}`)
     if (redisotp != otp) {
        throw BadRequestEception({ message: " otp does not match" })
    }
    userdata.isverfied = true
    await userdata.save()
    return userdata
}
export const getuser = async () => {
    let userdata = await userModel.find()
    return userdata
}