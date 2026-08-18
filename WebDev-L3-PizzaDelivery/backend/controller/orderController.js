import { prisma } from "../config/db.js";
import {OrderStatus} from "@prisma/client";
import { checkLowStock } from "../utils/inventoryNotification.js";
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    // --------------------------------
    // STEP 1: Validate order
    // --------------------------------
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item.",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // --------------------------------
    // STEP 2: Validate items & calculate total
    // --------------------------------
    for (const item of items) {
      if (!item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          message: "Quantity must be greater than 0.",
        });
      }

      let price = 0;

      // --------------------------------
      // REGULAR PIZZA
      // --------------------------------
      if (item.pizzaId) {
        const pizza = await prisma.pizza.findUnique({
          where: {
            id: Number(item.pizzaId),
          },
        });

        if (!pizza) {
          return res.status(404).json({
            message: `Pizza with id ${item.pizzaId} not found.`,
          });
        }

        // Check stock
        if (pizza.stock < item.quantity) {
          return res.status(400).json({
            message: `${pizza.name} does not have enough stock.`,
          });
        }

        price = pizza.price;

        orderItems.push({
          pizzaId: Number(item.pizzaId),
          customPizzaId: null,
          quantity: item.quantity,
        });
      }

      // --------------------------------
      // CUSTOM PIZZA
      // --------------------------------
      else if (item.customPizzaId) {
        const customPizza = await prisma.customPizza.findUnique({
          where: {
            id: Number(item.customPizzaId),
          },
          include: {
            base: true,
            sauce: true,
            cheese: true,
            vegetables: true,
          },
        });

        if (!customPizza) {
          return res.status(404).json({
            message: `Custom pizza with id ${item.customPizzaId} not found.`,
          });
        }

        // Check base
        if (customPizza.base.stock < item.quantity) {
          return res.status(400).json({
            message: `${customPizza.base.name} does not have enough stock.`,
          });
        }

        // Check sauce
        if (customPizza.sauce.stock < item.quantity) {
          return res.status(400).json({
            message: `${customPizza.sauce.name} does not have enough stock.`,
          });
        }

        // Check cheese
        if (customPizza.cheese.stock < item.quantity) {
          return res.status(400).json({
            message: `${customPizza.cheese.name} does not have enough stock.`,
          });
        }

        // Check vegetables
        for (const vegetable of customPizza.vegetables) {
          if (vegetable.stock < item.quantity) {
            return res.status(400).json({
              message: `${vegetable.name} does not have enough stock.`,
            });
          }
        }

        price = customPizza.price;

        orderItems.push({
          pizzaId: null,
          customPizzaId: Number(item.customPizzaId),
          quantity: item.quantity,
        });
      }

      // --------------------------------
      // INVALID ITEM
      // --------------------------------
      else {
        return res.status(400).json({
          message:
            "Each item must contain pizzaId or customPizzaId.",
        });
      }

      totalAmount += price * item.quantity;
    }

    // --------------------------------
    // STEP 3: Create order
    // IMPORTANT:
    // Inventory is NOT decreased here.
    // --------------------------------
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,

        items: {
          create: orderItems,
        },
      },

      include: {
        items: {
          include: {
            pizza: true,
            customPizza: true,
          },
        },
      },
    });

    // --------------------------------
    // STEP 4: Return order
    // --------------------------------
    res.status(201).json(order);

  } catch (error) {
    console.error("Error creating order:", error);

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
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
        if (!Object.values(OrderStatus).includes(status)){
            return res.status(400).json({message:"Invalid order status"});
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
//get orders belonging only to logged-in customer
export const getMyOrders=async (req,res)=>{
  try{
    const userId=req.user.id;
    const orders=await prisma.order.findMany({
      where:{
        userId:userId,
      },
      include:{
        items:{
          include:{
            pizza: true,
            customPizza: true,
          },
        },
      },
      orderBy:{
        id:"desc",
      }
    });
    res.status(200).json(orders)
  }catch(e){
    console.error("Error fetching my orders: ", e)
    res.status(500).json({
      message:"Internal server error",
    });
  }
}