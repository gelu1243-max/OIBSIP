import express from "express";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus,deleteOrder,getMyOrders} from "../controller/orderController.js";
import { authMiddleware } from "../middleware/authmiddleware.js";
import {adminMiddleware} from "../middleware/adminMiddleware.js"
const orderRouter=express.Router();

orderRouter.post("/orders",authMiddleware,createOrder);
orderRouter.get("/orders",authMiddleware,adminMiddleware,getAllOrders);
orderRouter.get("/orders/:orderId",authMiddleware,adminMiddleware,getOrderById);
orderRouter.patch("/orders/:orderId/status",authMiddleware,adminMiddleware,updateOrderStatus);
orderRouter.delete("/orders/:orderId",authMiddleware,adminMiddleware,deleteOrder);
orderRouter.get("/my-orders",authMiddleware,getMyOrders)

export default orderRouter;