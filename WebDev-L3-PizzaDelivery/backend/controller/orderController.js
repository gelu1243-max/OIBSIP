import {prisma} from '../config/db.js';
export const createOrder=async (req, res)=>{
    try{
        const userId=req.user.id;
        const{items} = req.body;
        if(!items ||!items.length===0){
            return res.status(400).json({message:"Order must contain at least one item."});
        }
        let totalAmount=0;
        const orderItems=[];
        for(const item of items){
            let price=0;
            if(item.pizzaId){
                const pizza=await prisma.pizza.findUnique({where:{id:item.pizzaId}});
                if(!pizza){
                    return res.status(400).json({message:`Pizza with id ${item.pizzaId} not found.`});
                }
                price=pizza.price;
            }
            else if(item.customPizzaId){
                const customPizza=await prisma.customPizza.findUnique({where:{id:item.customPizzaId}});
                if(!customPizza){
                    return res.status(400).json({message:`Custom pizza with id ${item.customPizzaId} not found.`});
                }
                price=customPizza.price;
            }
            totalAmount+=price*item.quantity;
            orderItems.push({
                pizzaId:item.pizzaId||null,
                customPizzaId:item.customPizzaId||null,
                quantity:item.quantity,
            });
        }
        const order=await prisma.order.create({
            data:{
                userId,
                totalAmount,
                items:{
                    create:orderItems,
                }}, 
            include:{
                    items:true,
                }
            
        });
        res.status(201).json(order);
    }catch(error){
        console.error("Error creating order:",error);
        res.status(500).json({error:"Internal server error"});
    }
}
//get all orders
export const getAllOrders=async (req, res)=>{
    try{
        const orders=await prisma.order.findMany({
            include:{
                user:true,
                items:{
                    include:{
                        pizza:true,
                        customPizza:true,
                    }
                }
            }
        });
        res.status(200).json(orders);
    }catch(error){
        console.error("Error fetching orders:",error);
        res.status(500).json({error:"Internal server error"});
    }
}
//get order by id
export const getOrderById=async(req,res)=>{
    try{
        const{orderId}=req.params;
        const order=await prisma.order.findUnique({
            where:{id:Number(orderId)},
            include:{
                user:true,
                items:{
                    include:{  
                        pizza:true,
                        customPizza:true,
                    }
                }
            }
        })
        if (!order){
            return res.status(404).json({message:"order not found"})

        }
        res.status(200).json(order);
    }catch(error){
        console.error("Error fetching order:",error);
        res.status(500).json({error:"Internal server error"});
    }
}
//update one field of order only(order status)
export const updateOrderStatus=async(req,res)=>{
    try{
        const{orderId}=req.params;
        const{status}=req.body;

        const order=await prisma.order.findUnique({
            where:{id:Number(orderId)},
        });
        if (!order){
            return res.status(404).json({message:"order not found"});
        }
        const updatedOrder=await prisma.order.update({
            where:{id:Number(orderId)},
            data:{status},
        });
        res.status(200).json(updatedOrder);
    }catch(error){
        console.error("Error updating order:",error);
        res.status(500).json({error:"Internal server error"});
    }}
//delete order by id
export const deleteOrder=async(req,res)=>{
    try{
        const {orderId}=req.params;
        const order=await prisma. order.findUnique({
            where:{id:Number(orderId)}
        })
        if(!order){
            return res.status(404).json({message:"order not found"});   
        }
        await prisma.order.delete({
            where:{id:Number(orderId)}
        });
        res.status(200).json({message:"order deleted successfully"});   
    }catch(error){
        console.error("Error deleting order:",error);
        res.status(500).json({error:"Internal server error"});  
    }
}