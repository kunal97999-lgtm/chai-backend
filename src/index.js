// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js"; // 1. Import your configured app from app.js instead of express

dotenv.config({
    path: './.env' // Note: Double check if your file is named '.env', it should have a dot: './.env'
})

// 2. REMOVED: const app = express() is gone from here!

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT || 8000}`);
    })
})
.catch((err)=>{
    console.log("MONGO DB connection failed !!", err);
})


/*
import express from "express";
const app = express()

(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error",() =>{
            console.log("application is not able to talk to database ERRR: ",error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.error("ERROR ",error)
        throw error
    }
})()

*/