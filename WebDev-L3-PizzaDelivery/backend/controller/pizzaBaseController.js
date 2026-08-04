import {prisma}from "../config/db.js"
export const getAllPizzaBase=async(req,res)=>{
    try{
        const pizzaBase=await prisma.PizzaBase.findMany();
        res.json(pizzaBase)
    }catch(error){
        res.status(500).json({
           message: 'Internal server error',
           error:error.message
        })
    }
}
export const getPizzaBaseByID=async(req,res)=>{
    try{
        const{id}=req.params;
        const pizzabase=await prisma.pizzaBase.findUnique({
            where:{id:Number(id)},
        })
        if(!pizzabase){
            return res.status(404).json({
                message:'pizzabase not found'
            })
        }
        res.status(200).json(pizzabase)
    }catch(error){
        res.status(500).json({
           message: 'Internal server error',
           error:error.message
        })
    }
}
export const createPizzabase=async(req,res)=>{
    try{
        const{name,stock,threshold,price}=req.body
        const pizzabase=await prisma.pizzaBase.create({
            data:{name,stock,threshold,price}
        })
        res.status(201).json(pizzabase)
    }catch(error){
        res.status(500).json({
          message: 'Internal server error',
          error:error.message
        })
    }
}
export const updatepizzabase=async(req,res)=>{
    try{
        const{id}=req.params
        const{name,stock,threshold,price}=req.body
        const pizzabase =await prisma.pizzaBase.findUnique({
            where:{id:Number(id)}
        })
        if(!pizzabase){
            return res.status(404).json({
                message:'Pizzabase not found'
            })
        }
        const updatepizzabase=await prisma.pizzaBase.update({
            where:{id:Number(id)},
            data:{name,stock,threshold,price}
        })
        res.status(200).json(updatepizzabase)
        
    }catch(error){
         res.status(500).json({
         message: 'Internal server error',
         error:error.message
        })
    }
}
export const deletePizzabase = async(req,res)=>{
    try{
      const{id} =req.params;
      const pizzabase= await prisma.pizzaBase.findUnique({
        where:{
            id: Number(id)
        }
      });
      if(!pizzabase){
        return res.status(404).json({
            message: "Pizzabase not found",
        })
      }
      await prisma.pizzaBase.delete({
        where:{
            id:Number(id)
        }
      })
      res.status(200).json({
        message:"Pizzabase deleted successfully",
      });
    }catch(error){
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};