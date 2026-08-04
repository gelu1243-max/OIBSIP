import {prisma}from "../config/db.js"
export const getAllvegetable=async(req,res)=>{
    try{
        const vegetable=await prisma.vegetable.findMany();
        res.json(vegetable)
    }catch(error){
        res.status(500).json({
           message: 'Internal server error',
           error:error.message
        })
    }
}
export const getvegetableByID=async(req,res)=>{
    try{
        const{id}=req.params;
        const vegetable=await prisma.vegetable.findUnique({
            where:{id:Number(id)},
        })
        if(!vegetable){
            return res.status(404).json({
                message:'vegetable not found'
            })
        }
        res.status(200).json(vegetable)
    }catch(error){
        res.status(500).json({
           message: 'Internal server error',
           error:error.message
        })
    }
}
export const createvegetable=async(req,res)=>{
    try{
        const{name,stock,threshold,price}=req.body
        const vegetable=await prisma.vegetable.create({
            data:{name,stock,threshold,price}
        })
        res.status(201).json(vegetable)
    }catch(error){
        res.status(500).json({
          message: 'Internal server error',
          error:error.message
        })
    }
}
export const updatevegetable=async(req,res)=>{
    try{
        const{id}=req.params
        const{name,stock,threshold,price}=req.body
        const vegetable =await prisma.vegetable.findUnique({
            where:{id:Number(id)}
        })
        if(!vegetable){
            return res.status(404).json({
                message:'vegetable not found'
            })
        }
        const updatevegetable=await prisma.vegetable.update({
            where:{id:Number(id)},
            data:{name,stock,threshold,price}
        })
        res.status(200).json(updatevegetable)
        
    }catch(error){
         res.status(500).json({
         message: 'Internal server error',
         error:error.message
        })
    }
}
export const deletevegetable = async(req,res)=>{
    try{
      const{id} =req.params;
      const vegetable= await prisma.vegetable.findUnique({
        where:{
            id: Number(id)
        }
      });
      if(!vegetable){
        return res.status(404).json({
            message: "vegetable not found",
        })
      }
      await prisma.vegetable.delete({
        where:{
            id:Number(id)
        }
      })
      res.status(200).json({
        message:"vegetable deleted successfully",
      });
    }catch(error){
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};