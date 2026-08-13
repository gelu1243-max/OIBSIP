import express from "express"
import {getAllPizzas,getpizzaById,createPizza,updatePizza,deletePizza}from "../controller/pizzaController.js"
import {authMiddleware} from "../middleware/authmiddleware.js"
import {adminMiddleware} from "../middleware/adminMiddleware.js"
 export const pizzarouter=express.Router()
pizzarouter.get("/pizzas",getAllPizzas)
pizzarouter.get("/pizzas/:id",getpizzaById)
pizzarouter.post("/pizzas",authMiddleware,adminMiddleware,createPizza)
pizzarouter.put("/pizzas/:id",authMiddleware,adminMiddleware,updatePizza)
pizzarouter.delete("/pizzas/:id",authMiddleware,adminMiddleware,deletePizza)