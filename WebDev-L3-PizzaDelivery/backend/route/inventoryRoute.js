import express from "express"
import {getAllPizzaBase,getPizzaBaseByID,createPizzabase,updatepizzabase,deletePizzabase}from "../controller/pizzaBaseController.js"
import { createsauce, deletesauce, getAllsauce,getsauceByID, updatesauce } from "../controller/saucesController.js";
import { createcheese, deletecheese, getAllcheese, getcheeseByID, updatecheese } from "../controller/cheesesController.js";
import { createvegetable, deletevegetable, getAllvegetable, getvegetableByID, updatevegetable } from "../controller/vegetableController.js";
import {authMiddleware} from "../middleware/authmiddleware.js";
import {adminMiddleware} from "../middleware/adminMiddleware.js";
 export const inventoryrouter=express.Router()
 //pizzabase
inventoryrouter.get("/pizzabases",getAllPizzaBase)
inventoryrouter.get("/pizzabases/:id",getPizzaBaseByID)
inventoryrouter.post("/pizzabases",authMiddleware,adminMiddleware,createPizzabase)
inventoryrouter.put("/pizzabases/:id",authMiddleware,adminMiddleware,updatepizzabase)
inventoryrouter.delete("/pizzabases/:id",authMiddleware,adminMiddleware,deletePizzabase)
//sauces
inventoryrouter.get("/sauce",getAllsauce)
inventoryrouter.get("/sauce/:id",getsauceByID)
inventoryrouter.post("/sauce",authMiddleware,adminMiddleware,createsauce)
inventoryrouter.put("/sauce/:id",authMiddleware,adminMiddleware,updatesauce)
inventoryrouter.delete("/sauce/:id",authMiddleware,adminMiddleware,deletesauce)
//cheeses
inventoryrouter.get("/cheese",getAllcheese)
inventoryrouter.get("/cheese/:id",getcheeseByID)
inventoryrouter.post("/cheese",authMiddleware,adminMiddleware,createcheese)
inventoryrouter.put("/cheese/:id",authMiddleware,adminMiddleware,updatecheese)
inventoryrouter.delete("/cheese/:id",authMiddleware,adminMiddleware,deletecheese)
//vegetable
inventoryrouter.get("/vegetables",getAllvegetable)
inventoryrouter.get("/vegetables/:id",getvegetableByID)
inventoryrouter.post("/vegetables",authMiddleware,adminMiddleware,createvegetable)
inventoryrouter.put("/vegetables/:id",authMiddleware,adminMiddleware,updatevegetable)
inventoryrouter.delete("/vegetables/:id",authMiddleware,adminMiddleware,deletevegetable)