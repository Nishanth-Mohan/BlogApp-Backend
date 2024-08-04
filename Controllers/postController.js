import Post from "../Models/postModel.js";
import { errorHandler } from "../Utils/error.js";

export const createPost = async(req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403,'You are not allowed to create a post'))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400,'All the fields are required'))
    }
    const {content,title,image,category}=req.body;
    const newPost= new Post({content,title,image,category})

    try {
        const savedPost = newPost.save();
        res.status(200).json({message:'Post Created Successfully',result:savedPost})
    } catch (error) {
        next(error)
    }
}

export const getAllPost = async(req,res,next)=>{
    try {
        const posts = await Post.find()
        res.status(200).json(posts)
    } catch (error) {
        next(error)
    }
}

/// In the above getAllPost, we write queries to acheive pagination and search functionality also can be done here using inbuilt method (req.query.searchTerm)