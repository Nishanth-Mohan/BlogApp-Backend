import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./Database/config.js";
import authRoute from "./Routers/authRouter.js";

dotenv.config();

//initialization/declaration part
const app = express();

//middleware part
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

//error handler part
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({message,statusCode,success:false})
})

//connecting part
connectDB()
//default route
app.get("/", (req,res)=>{
  res.status(200).send("Welcome to BlogApp")
})

//API part
app.use('/api/auth',authRoute)

//listening port
app.listen(process.env.PORT,()=>{
    console.log("APP is running on the port");
})

