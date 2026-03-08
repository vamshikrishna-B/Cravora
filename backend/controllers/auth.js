import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import gettokens from "../utils/token.js";

export const signup = async(req,res)=>{
    try {
        const {name,email,password,mobile,role} = req.body;
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }
        if(mobile.length !== 10){
            return res.status(400).json({message:"Mobile number must be 10 digits long"});
        }
        const hashedpassword = await bcrypt.hash(password,10);
        user = await User.create({
            fullname,
            email,
            password:hashedpassword,
            mobile,
            role
        });
        const token = await gettokens(user._id);
        res.cookie("token",token,{
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        }
        )
        return res.status(201).json(user);
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
    }
}

export const signin = async(req,res)=>{
    try {
        const {email,password} = req.body;
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
        }
        )
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message:"signin failed"});
    }
}

export const signout = async(req,res)=>{
    try {
        res.clearCookie("token");
        return res.status(200).json({message:"signout successful"});
    } catch (error) {
        res.status(500).json({message:"signout failed"});
    }
}