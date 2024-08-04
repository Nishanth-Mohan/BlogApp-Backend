import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./Database/config.js";
import authRoute from "./Routers/authRouter.js";
import userRoute from "./Routers/userRouter.js";
import cookieParser from "cookie-parser";
import postRoute from "./Routers/postRouter.js";

dotenv.config();

//initialization/declaration part
const app = express();

//middleware part
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//connecting part
connectDB()
//default route
app.get("/", (req,res)=>{
  res.status(200).send("Welcome to BlogApp")
})

//API part
app.use('/api/auth',authRoute)
app.use('/api/user',userRoute)
app.use('/api/post',postRoute)

//Error handling middleware should be at the end
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({message,statusCode,success:false})    
})

//listening port
app.listen(process.env.PORT,()=>{
    console.log("APP is running on the port");
})

