import User from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../Utils/error.js";


export const registerUser = async(req,res)=>{
    const {username, email, password} = req.body;
    if(!username || !email || !password || username==="" || email==="" || password===""){
       return next(errorHandler(400,'All the fields are required'))
    }
    const hashedPassword = await bcryptjs.hash(password,10)   ///if error showed in deployment use "hashSync" instead of "hash".Both are same only.
    
   try {
     const newUser = await new User({username, email, password:hashedPassword});
     await newUser.save();
     res.status(200).json({message:"User Registered Successfully",result:newUser})
   } catch (error) {
    console.log(error);
    next(error)
   }
}