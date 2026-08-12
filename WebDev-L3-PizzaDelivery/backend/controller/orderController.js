import { prisma } from "../config/db.js";
import {OrderStatus} from "@prisma/client";
import { checkLowStock } from "../utils/inventoryNotification.js";
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item.",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // ----------------------------
    // STEP 1: Validate and calculate total
    // ----------------------------
    for (const item of items) {
          if (item.quantity <= 0) {
        return res.status(400).json({
            message: "Quantity must be greater than 0.",
        });
    }
      let price = 0;

      // ---------- Regular Pizza ----------
      if (item.pizzaId) {
        const pizza = await prisma.pizza.findUnique({
          where: { id: Number(item.pizzaId) },
        });

        if (!pizza) {
          return res.status(404).json({
            message: `Pizza with id ${item.pizzaId} not found.`,
          });
        }

        if (pizza.stock < item.quantity) {
          return res.status(400).json({
            message: `${pizza.name} does not have enough stock.`,
          });
        }

        price = pizza.price;
      }

      // ---------- Custom Pizza ----------
      else if (item.customPizzaId) {
        const customPizza = await prisma.customPizza.findUnique({
          where: { id: Number(item.customPizzaId) },
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

        if (
          customPizza.base.stock < item.quantity ||
          customPizza.sauce.stock < item.quantity ||
          customPizza.cheese.stock < item.quantity
        ) {
          return res.status(400).json({
            message: "One or more ingredients are out of stock.",
          });
        }

        for (const veg of customPizza.vegetables) {
          if (veg.stock < item.quantity) {
            return res.status(400).json({
              message: `${veg.name} is out of stock.`,
            });
          }
        }

        price = customPizza.price;
      } else {
        return res.status(400).json({
          message: "Each item must contain pizzaId or customPizzaId.",
        });
      }

      totalAmount += price * item.quantity;

      orderItems.push({
        pizzaId: item.pizzaId || null,
        customPizzaId: item.customPizzaId || null,
        quantity: item.quantity,
      });
    }

    // ----------------------------
    // STEP 2: Transaction
    // ----------------------------

    const order = await prisma.$transaction(async (tx) => {

      // Reduce inventory
      for (const item of items) {

        // ---------- Regular Pizza ----------
        if (item.pizzaId) {
          await tx.pizza.update({
            where: { id: Number(item.pizzaId) },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // ---------- Custom Pizza ----------
        else {

          const customPizza = await tx.customPizza.findUnique({
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

          await tx.pizzaBase.update({
            where: {
              id: customPizza.baseId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          await tx.sauce.update({
            where: {
              id: customPizza.sauceId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          await tx.cheese.update({
            where: {
              id: customPizza.cheeseId,
            },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          for (const veg of customPizza.vegetables) {
            await tx.vegetable.update({
              where: {
                id: veg.id,
              },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
          }
        }
      }

      // Create order
      const createdOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      return createdOrder;
    });
    await checkLowStock();
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