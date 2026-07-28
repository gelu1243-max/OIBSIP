import {prisma} from '../config/db.js';
export const getprofile=async(req,res)=>{
    try{
        const userId=req.user.id;
        const user =await prisma.User.findUnique({
            where:{id:userId},
            select:{id:true, name:true, email:true}
        });
        if(!user){
            return res.status(404).json({message: "User not found"})
        } 
       res.status(200).json({message: "User profile fetched successfully", user})
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Error fetching user profile", error})
    }
}