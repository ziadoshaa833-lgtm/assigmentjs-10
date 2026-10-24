import express from "express"
import { env } from "./config/env.service.js";
import authRouter from"./module/auth/auth.controller.js"
import { databaseConnection } from "./database/connection.js";
import {fileURLToPath} from 'url'
import path from 'path'
import { redisConnection } from "./database/redis/connection.js";


const __fileneme=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__fileneme)
const  uploadpath=path.resolve(__dirname,'../uploads')






const app=express()

app.use(express.json())
app.use("/auth",authRouter)
app.use("/uploads",express.static(uploadpath))
databaseConnection()
export const client=await redisConnection()
client.set("test","ziad")


app.use((err,req,res,next)=>{
console.log(err);
let stack=env.Mood=="dev"?err.stack:null
const status=err.cause?err.cause.status:500
const extra=err.cause?err.cause.extra:null
res.status(status).json({message:err.message,stack,extra})
})






app.listen(env.port,()=>{
    console.log("server is runing");
    
})