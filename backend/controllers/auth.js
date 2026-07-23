import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import gettokens from "../utils/token.js";

export const signup = async(req,res)=>{
    try {
        const {fullname,email,password,mobile,role} = req.body;
        if (!fullname || !email || !password || !mobile || !role) {
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }
        if(mobile.length !== 10){
            return res.status(400).json({message:"Mobile number must be 10 digits long"});
        }
        const hashedpassword = await bcrypt.hash(password,10);
        const newUser = await User.create({
            fullname,
            email,
            password:hashedpassword,
            mobile,
            role
        });
        const token = await gettokens(newUser._id);
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        });
        const { password: _pw, ...userWithoutPassword } = newUser.toObject();
        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

export const signin = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email and password are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token = await gettokens(user._id);
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        });
        const { password: _pw, ...userWithoutPassword } = user.toObject();
        return res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({message:"Signin failed"});
    }
}

export const signout = async(req,res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({message:"Signout successful"});
    } catch (error) {
        res.status(500).json({message:"Signout failed"});
    }
}

export const getMe = async(req,res)=>{
    try {
        // req.user is already set by protect middleware (no password)
        return res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({message:"Failed to fetch profile"});
    }
}