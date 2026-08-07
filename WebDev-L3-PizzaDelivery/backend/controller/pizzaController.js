import {prisma} from '../config/db.js';
export const getAllPizzas = async (req, res) => {
    try{
        const pizzas = await prisma.Pizza.findMany();
        res.json(pizzas);
    } catch (error) {
        console.error('Error fetching pizzas:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getpizzaById = async(req, res) =>{
    try {
        const {id} = req.params;
        const pizza = await prisma.Pizza.findUnique({
            where: {id: Number(id)}
        });
        if (!pizza) {
            return res.status(404).json({ error: 'Pizza not found' });
        }

        res.status(200).json(pizza);
    } catch (error) {
        console.error('Error fetching pizza:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const createPizza = async (req, res) =>{
    try{
        const{name, description, price, imageUrl, stock} = req.body;
        const pizza = await prisma.Pizza.create({
            data: {name, description, price, imageUrl, stock}
        });
        res.status(201).json(pizza);
    } catch (error) {
        console.error('Error creating pizza:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updatePizza=async(req,res)=>{
    try{
        const{id} = req.params;
        const{name, description, price, imageUrl, stock} = req.body;
        const pizza=await prisma.pizza.findUnique({
            where:{
                id:Number(id)
            }
        });
        if(!pizza){
            res.status(404).json({
                message:"Pizza not found"
            })
        }
        const updatepizza = await prisma.Pizza.update({
            where: {id: Number(id)},
            data: {name, description, price, imageUrl, stock}
        });
        res.status(200).json(updatepizza);

    } catch (error) {
        console.error('Error updating pizza:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deletePizza = async(req,res)=>{
    try{
      const{id} =req.params;
      const pizza= await prisma.pizza.findUnique({
        where:{
            id: Number(id)
        }
      });
      if(!pizza){
        res.status(404).json({
            message: "Pizza not found",
        })
      }
      await prisma.pizza.delete({
        where:{
            id:Number(id)
        }
      })
      res.status(200).json({
        message:"Pizza deleted successfully",
      });
    }catch{
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};