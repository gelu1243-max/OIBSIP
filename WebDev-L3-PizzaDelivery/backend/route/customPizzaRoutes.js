import express from "express";
import { authMiddleware } from "../middleware/authmiddleware.js";
import {
  createCustomPizza,
  getAllCustomPizzas,
  getCustomPizzaById,
  deleteCustomPizza,
} from "../controller/customPizzaController.js";

const customPizzaRouter = express.Router();

customPizzaRouter.post("/custom-pizzas", authMiddleware, createCustomPizza);
customPizzaRouter.get("/custom-pizzas", authMiddleware, getAllCustomPizzas);
customPizzaRouter.get("/custom-pizzas/:id", authMiddleware, getCustomPizzaById);
customPizzaRouter.delete("/custom-pizzas/:id", authMiddleware, deleteCustomPizza);

export default customPizzaRouter ;