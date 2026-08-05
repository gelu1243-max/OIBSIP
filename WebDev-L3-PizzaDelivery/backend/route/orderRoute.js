import express from "express";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus,deleteOrder } from "../controller/orderController.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const orderRouter=express.Router();

orderRouter.post("/orders",authMiddleware,createOrder);
orderRouter.get("/orders",authMiddleware,getAllOrders);
orderRouter.get("/orders/:orderId",authMiddleware,getOrderById);
orderRouter.patch("/orders/:orderId/status",authMiddleware,updateOrderStatus);
orderRouter.delete("/orders/:orderId",authMiddleware,deleteOrder);

export default orderRouter;