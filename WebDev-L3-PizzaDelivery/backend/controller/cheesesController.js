import {prisma}from "../config/db.js"
export const getAllcheese=async(req,res)=>{
    try{
        const cheese=await prisma.cheese.findMany();
        res.json(cheese)
    }catch(error){
        res.status(500).json({
           message: 'Internal server error',
           error:error.message
        })
    }
}
export const getcheeseByID=async(req,res)=>{
    try{
        const{id}=req.params;
        const cheese=await prisma.cheese.findUnique({
            where:{id:Number(id)},
        })
        if(!cheese){
            return res.status(404).json({
                message:'cheese not found'
            })
        }
        res.status(200).json(cheese)
    }catch(error){
        res.status(500).json({
           message: 'Internal server error',
           error:error.message
        })
    }
}
export const createcheese=async(req,res)=>{
    try{
        const{name,stock,threshold}=req.body
        const cheese=await prisma.cheese.create({
            data:{name,stock,threshold}
        })
        res.status(201).json(cheese)
    }catch(error){
        res.status(500).json({
          message: 'Internal server error',
          error:error.message
        })
    }
}
export const updatecheese=async(req,res)=>{
    try{
        const{id}=req.params
        const{name,stock,threshold}=req.body
        const cheese =await prisma.cheese.findUnique({
            where:{id:Number(id)}
        })
        if(!cheese){
            return res.status(404).json({
                message:'cheese not found'
            })
        }
        const updatecheese=await prisma.cheese.update({
            where:{id:Number(id)},
            data:{name,stock,threshold}
        })
        res.status(200).json(updatecheese)
        
    }catch(error){
         res.status(500).json({
         message: 'Internal server error',
         error:error.message
        })
    }
}
export const deletecheese = async(req,res)=>{
    try{
      const{id} =req.params;
      const cheese= await prisma.cheese.findUnique({
        where:{
            id: Number(id)
        }
      });
      if(!cheese){
        return res.status(404).json({
            message: "cheese not found",
        })
      }
      await prisma.cheese.delete({
        where:{
            id:Number(id)
        }
      })
      res.status(200).json({
        message:"cheese deleted successfully",
      });
    }catch(error){
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};