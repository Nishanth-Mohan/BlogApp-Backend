import User from "../Models/userModel.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../Utils/error.js";

export const updateUser = async(req,res,next)=>{
    if(req.user.id !== req.params.id){
        return next(errorHandler(401,'You are not allowed to update this user'))
    }
    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(401,'Password must be atleast 6 characters'))
        }
    }
    if(!req.body.password){
        return next(errorHandler(400,`Password is required`))
    }
    req.body.password = bcryptjs.hashSync(req.body.password,10);

    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 16){
            return next(errorHandler(401,'username must be above 7 and below 16 characters'))
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(401,'username must not contain spaces'))
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(401,'username must be lowercase'))
        }
        if(!req.body.username.match(/^[A-Za-z0-9 ]+$/)){
            return next(errorHandler(400,'username can only contain letters and numbers'))
        }
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                profilePicture:req.body.profilePicture
            },

        },{
            new:true
        })

        const {password,...rest}=updatedUser._doc
        res.status(200).json(rest);

    } catch (error) {
        next(error)
    }

}

export const deleteUser = async(req,res,next)=>{
     if(req.user.id !== req.params.id){
        return next(errorHandler(401,'You are not allowed to update this user'))
     }
     try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User Deleted Successfully')
     } catch (error) {
        next(error)
     }
}

export const getUsers = async(req,res,next)=>{
    //    const {id} = req.user; 
    //    console.log(id);
    //    const userDetail = await User.findOne({id})
    //    console.log(userDetail);
    //    if(userDetail.isAdmin === false){
    //     return next(errorHandler(401,'You are not Admin'))
    //    }
    try {
        const users = await User.find()                  
        const usersWithoutPassword = users.map((ele)=>{
           const {password,...rest} = ele.toObject();  //Convert each user document to a plain JavaScript object and omit the password field
           return rest;                                  
        })
        res.status(200).json(usersWithoutPassword)
    } catch (error) {
        next(error)
    }
}