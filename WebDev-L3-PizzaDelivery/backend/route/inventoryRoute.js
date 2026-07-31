import express from "express"
import {getAllPizzaBase,getPizzaBaseByID,createPizzabase,updatepizzabase,deletePizzabase}from "../controller/pizzaBaseController.js"
import { createsauce, deletesauce, getAllsauce,getsauceByID, updatesauce } from "../controller/saucesController.js";
import { createcheese, deletecheese, getAllcheese, getcheeseByID, updatecheese } from "../controller/cheesesController.js";
import { createvegetable, deletevegetable, getAllvegetable, getvegetableByID, updatevegetable } from "../controller/vegetableController.js";
 export const inventoryrouter=express.Router()
 //pizzabase
inventoryrouter.get("/pizzabases",getAllPizzaBase)
inventoryrouter.get("/pizzabases/:id",getPizzaBaseByID)
inventoryrouter.post("/pizzabases",createPizzabase)
inventoryrouter.put("/pizzabases/:id",updatepizzabase)
inventoryrouter.delete("/pizzabases/:id",deletePizzabase)
//sauces
inventoryrouter.get("/sauce",getAllsauce)
inventoryrouter.get("/sauce/:id",getsauceByID)
inventoryrouter.post("/sauce",createsauce)
inventoryrouter.put("/sauce/:id",updatesauce)
inventoryrouter.delete("/sauce/:id",deletesauce)
//cheeses
inventoryrouter.get("/cheese",getAllcheese)
inventoryrouter.get("/cheese/:id",getcheeseByID)
inventoryrouter.post("/cheese",createcheese)
inventoryrouter.put("/cheese/:id",updatecheese)
inventoryrouter.delete("/cheese/:id",deletecheese)
//vegetable
inventoryrouter.get("/vegetables",getAllvegetable)
inventoryrouter.get("/vegetables/:id",getvegetableByID)
inventoryrouter.post("/vegetables",createvegetable)
inventoryrouter.put("/vegetables/:id",updatevegetable)
inventoryrouter.delete("/vegetables/:id",deletevegetable)