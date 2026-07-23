import jwt from "jsonwebtoken";

const gettokens = async(userId)=>{
    try{
        const token = jwt.sign({user_id:userId},process.env.JWT_SECRET,{expiresIn:"7d"});
        return token;
    } catch(error){
        console.log("Token generation failed");
    }
}

export default gettokens;