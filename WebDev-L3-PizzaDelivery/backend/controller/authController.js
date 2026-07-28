import {prisma} from "../config/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
//Register
export const registerUser =async (req,res)=>{
    try{
        const {name,email, password}= req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user= await prisma.User.create({
            data:{name, email, password: hashedPassword,}

        })
        res.status(201).json({message: "User created successfully", user})
    } catch (error) {
        res.status(500).json({message: "Error creating user", error})
    }
}
//Login
export const loginUser =async(req, res)=>{
    try{
        const {email,password}=req.body;
        const user= await prisma.User.findUnique({
            where:{email}
        })
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"})
        }
        const token= jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.json({message: "Login successful", token})
    } catch (error) {
        res.status(500).json({message: "Error logging in", error})
    }

}
export default {registerUser, loginUser};