import jwt from 'jsonwebtoken';
import { errorHandler } from '../Utils/error.js';
import dotenv from 'dotenv'

dotenv.config();

export const middleWare = (req,res,next)=>{
     const token = req.headers.token;
     if(!token){
       return next(errorHandler(401,'Unauthorized Access'))
     }
     const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
     req.user = decode;
     next();

}
