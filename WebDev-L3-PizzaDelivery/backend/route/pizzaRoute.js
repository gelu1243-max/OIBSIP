import express from "express"
import {getAllPizzas,getpizzaById,createPizza,updatePizza,deletePizza}from "../controller/pizzaController.js"
 export const pizzarouter=express.Router()
pizzarouter.get("/pizzas",getAllPizzas)
pizzarouter.get("/pizza/:id",getpizzaById)
pizzarouter.post("/pizzas",createPizza)
pizzarouter.put("/pizzas/:id",updatePizza)
pizzarouter.delete("/pizza/:id",deletePizza)