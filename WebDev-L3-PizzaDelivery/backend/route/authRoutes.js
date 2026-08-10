import express from "express";
import {registerUser, loginUser,verifyEmail} from "../controller/authController.js";
import {getprofile} from "../controller/profilecontroller.js";
import {authMiddleware }from "../middleware/authmiddleware.js"; 

const router = express.Router();
router.post('/register', registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail);
router.get("/profile", authMiddleware, getprofile);

export default router;