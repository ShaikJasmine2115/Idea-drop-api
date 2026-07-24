import {jwtVerify} from "jose";
import User from "../models/User.js";
import { JWT_SECRET } from "../utils/getJwtSecret.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            res.status(401);
            throw new Error("Unauthorized");
        }

        const token = authHeader.split(' ')[1];
        const {payload} = await jwtVerify(token, JWT_SECRET);
        const user = await User.findById(payload.userId).select('_id name email');
        if(!user){
            res.status(401);
            throw new Error("Unauthorized");
        }
        req.user = user;
        next();
    }
    catch(error){
        console.log(error);
        res.status(401);
        next(new Error("Unauthorized"));
    }
};