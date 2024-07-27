import User from "../Models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../Utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerUser = async(req,res,next)=>{
    const {username, email, password} = req.body;
    // Validate input
    if(!username || !email || !password || username==="" || email==="" || password===""){
       return next(errorHandler(400,'All the fields are required'))
    }
    
   try {
     // Hash password
     const hashedPassword = await bcryptjs.hashSync(password,10)   ///if error showed in deployment use "hashSync" instead of "hash".Both are same only.
     // Create new user instance
     const newUser = await new User({username, email, password:hashedPassword});
     // Save user to database
     await newUser.save();
     // Respond with success message and user details
     res.status(200).json({message:"User Registered Successfully",result:newUser})
   } catch (error) {
    console.log(error);
    // Pass error to the next middleware (error handler)
    next(error)
   }
}

export const loginUser = async(req,res,next)=>{
     const {email, password} = req.body;
     if(!email || !password){
         return next(errorHandler(400,'All the fields are required'));
     }
     try {
         const userDetail = await User.findOne({email});
         const userPassword = await bcryptjs.compareSync(password,userDetail.password);
         if(!userDetail || !userPassword){
           return next(errorHandler(400,'Invalid credentials'));
         }
       const token = jwt.sign({id:userDetail._id},process.env.JWT_SECRET_KEY);

       const {password:passkey,...rest} = userDetail._doc;

       res.status(200).cookie("Access_token",token,{
         httpOnly:true
       }).json({message:"User Loggedin Successfully",rest})
     } catch (error) {
      console.log(error);
      next(error)
     }  
}

export const google = async(req,res,next)=>{
   const  {email,name,profilePic} = req.body;
   try {
      const user = await User.findOne({email});
      if(user){
          const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);
          const {password:passkey,...rest} = user._doc;
          res.status(200).cookie("Access_token",token,{
            httpOnly:true
          }).json({message:"User Loggedin Successfully",rest})
      } 
      else{
         const generatePassword = Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
         const hashedPassword = await bcryptjs.hashSync(generatePassword,10);
         const newUser = await new User({
            username:name.toLowerCase().split(" ").join("")+Math.random().toString(9).slice(-4),
            email,
            password:hashedPassword,
            profilePicture:profilePic
         });
         await newUser.save();
      }
   } catch (error) {
      next(error)
   }
}

// export const gitHub = async(req,res,next)=>{
//    const {name,email,profilePic}=req.body;
//    try {
//       const user = User.findOne({email});
//       if(user){
//          const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);
//          const {username,profilePicture} = user;
//          res.status(200).cookie('Access_Token',token,{
//             httpOnly:true
//          }).json({message:'User Loggedin Successfully',username, profilePicture})
//       }
//       else{
//          const newUser = await new User({
//             username: name,
//             email,
//             profilePicture:profilePic
//          })
//          await newUser.save()
//          const { username, profilePicture } = newUser;
//          res.status(200).json({ message: 'User Registered and Loggedin Successfully', username, profilePicture });
//       }
//    } catch (error) {
//       next(error)
//    }
// }

