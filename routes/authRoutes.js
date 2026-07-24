import express from "express";
import User from "../models/User.js";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "../utils/getJwtSecret.js";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();

// @route     POST /api/auth/register
// @desc      Register a new user
// @access    Public
router.post('/register', async (req,res, next)=>{
    try{
        const { name, email, password } = req.body || {};

        if(!name || !email || !password){
            res.status(400);
            throw new Error("Please fill in all fields");
        }

        const existingUser = await User.findOne({ email });

        if(existingUser){
            res.status(400);
            throw new Error("User already exists");
        }

        const user = await User.create({ name, email, password });

        //create tokens
        const payload = { userId: user._id.toString() };
        const accessToken = await generateToken(payload, "1m");
        const refreshToken = await generateToken(payload, "7d");

        //set refresh token in HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            accessToken,
            user:{
            _id: user._id,
            name: user.name,
            email: user.email,
            },
        });

    }catch(error){
        console.log(error);
        next(error);
    }
});

// @route     POST /api/auth/login
// @desc      Authenticate a user
// @access    Public
router.post('/login', async (req,res, next)=>{
    try{
        const { email, password } = req.body || {};

        if(!email || !password){
            res.status(400);
            throw new Error("Please fill in all fields");
        }

        const user = await User.findOne({ email });
        
        if(!user){
            res.status(401);
            throw new Error("Invalid credentials");
        }

        //check password
        const isMatch = await user.matchPassword(password);
        
        if(!isMatch){
            res.status(401);
            throw new Error("Invalid credentials");
        }

        //create the tokens
        const payload = { userId: user._id.toString() };
        const accessToken = await generateToken(payload, "1m");
        const refreshToken = await generateToken(payload, "7d");

        //set refresh token in HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            accessToken,
            user:{
            _id: user._id,
            name: user.name,
            email: user.email,
            },
        });

    }
    catch(error){
        console.log(error);
        next(error);
    }
});


// @route     POST /api/auth/logout
// @desc      Logout a user and clear refresh token
// @access    Private
router.post('/logout', async (req,res, next)=>{
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
    });
    res.status(200).json({ message: "Logged out successfully" });
});


// @route     POST /api/auth/refresh
// @desc      Generate a new access token from Refresh token
// @access    Public (Needs valid refresh token in cookie)
router.post('/refresh', async (req,res, next)=>{
    try{
        const token = req.cookies?.refreshToken;
        console.log('Refreshing token...')
        
        if(!token){
            res.status(401);
            throw new Error("No refresh token");
        }

        const {payload} = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId;

        const user = await User.findById(userId);

        if(!user){
            res.status(401);
            throw new Error("User not found");
        }

        //create new access token
        const newAccessToken = await generateToken({userId: user._id.toString()}, "1m");

        res.json({ 
            accessToken: newAccessToken,
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
            } 
        });

    }catch(error){
        res.status(401);
        next(error);
    }
});



export default router;