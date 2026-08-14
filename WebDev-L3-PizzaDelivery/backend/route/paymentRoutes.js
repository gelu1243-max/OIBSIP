import express from "express";
import {createPayment,verifyPayment} from "../controller/paymentController.js";
import {authMiddleware} from "../middleware/authmiddleware.js";
const paymentRouter=express.Router();

paymentRouter.post("/create", authMiddleware, createPayment);
paymentRouter.post("/verify", authMiddleware, verifyPayment);
export default paymentRouter;