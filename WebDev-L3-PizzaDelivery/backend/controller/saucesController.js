import {prisma}from "../config/db.js"
export const getAllsauce=async(req,res)=>{
    try{
        const sauce=await prisma.sauce.findMany();
        res.json(sauce)
    }catch(error){
        res.status(500).json({
           message: 'Internal server error',
           error:error.message
        })
    }
}
export const getsauceByID=async(req,res)=>{
    try{
        const{id}=req.params;
        const sauce=await prisma.sauce.findUnique({
            where:{id:Number(id)},
        })
        if(!sauce){
            return res.status(404).json({
                message:'sauce not found'
            })
        }
        res.status(200).json(sauce)
    }catch(error){
        res.status(500).json({
           message: 'Internal server error',
           error:error.message
        })
    }
}
export const createsauce=async(req,res)=>{
    try{
        const{name,stock,threshold}=req.body
        const sauce=await prisma.sauce.create({
            data:{name,stock,threshold}
        })
        res.status(201).json(sauce)
    }catch(error){
        res.status(500).json({
          message: 'Internal server error',
          error:error.message
        })
    }
}
export const updatesauce=async(req,res)=>{
    try{
        const{id}=req.params
        const{name,stock,threshold}=req.body
        const sauce =await prisma.sauce.findUnique({
            where:{id:Number(id)}
        })
        if(!sauce){
            return res.status(404).json({
                message:'sauce not found'
            })
        }
        const updatesauce=await prisma.sauce.update({
            where:{id:Number(id)},
            data:{name,stock,threshold}
        })
        res.status(200).json(updatesauce)
        
    }catch(error){
         res.status(500).json({
         message: 'Internal server error',
         error:error.message
        })
    }
}
export const deletesauce = async(req,res)=>{
    try{
      const{id} =req.params;
      const sauce= await prisma.sauce.findUnique({
        where:{
            id: Number(id)
        }
      });
      if(!sauce){
        return res.status(404).json({
            message: "sauce not found",
        })
      }
      await prisma.sauce.delete({
        where:{
            id:Number(id)
        }
      })
      res.status(200).json({
        message:"sauce deleted successfully",
      });
    }catch(error){
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};