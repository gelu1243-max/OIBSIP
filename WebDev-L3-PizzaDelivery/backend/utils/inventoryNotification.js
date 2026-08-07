import { prisma } from "../config/db.js";
import { sendEmail } from "./email.js";

export const checkLowStock = async () => {
  try {
    // Check pizza bases
    const bases = await prisma.pizzaBase.findMany();
    for (const base of bases) {
         console.log(
        `${base.name}: stock=${base.stock}, threshold=${base.threshold}`
      );
      if (base.stock <= base.threshold) {
        await sendEmail(
          process.env.ADMIN_EMAIL,
          "Low Pizza Base Stock Alert",
          `Warning!

Pizza Base: ${base.name} is low in stock.
Current Stock: ${base.stock}


Please restock this pizza base.`
        );
      }
    }
//--------------------------
//check pizzas
//--------------------------
    const pizzas = await prisma.pizza.findMany();
    for(const pizzaitem of pizzas){
        if(pizzaitem.stock <= pizzaitem.threshold){
            await sendEmail(
                process.env.ADMIN_EMAIL,
                "Low Pizza Stock Alert",
                `Warning!
Pizza: ${pizzaitem.name} is low in stock.
Current Stock: ${pizzaitem.stock}


Please restock this pizza.`

            );
        }
    }
// --------------------------
//check sauces
//--------------------------
    const sauces = await prisma.sauce.findMany();
    for(const sauceitem of sauces){
        if(sauceitem.stock <= sauceitem.threshold){
            await sendEmail(
                process.env.ADMIN_EMAIL,
                "Low Sauce Stock Alert",
                `Warning!

Sauce: ${sauceitem.name} is low in stock.
Current Stock: ${sauceitem.stock}


Please restock this sauce.`

            );
        }
    }
// ---------------------------
// check cheeses
//---------------------------
    const cheeses = await prisma.cheese.findMany();
    for(const cheeseitem of cheeses){
        if(cheeseitem.stock <= cheeseitem.threshold){
            await sendEmail(
                process.env.ADMIN_EMAIL,
                "Low Cheese Stock Alert",
                `Warning!
       
Cheese: ${cheeseitem.name} is low in stock.
Current Stock: ${cheeseitem.stock}


Please restock this cheese.`

            );
        }
    }
// ---------------------------
// check vegetable
//---------------------------
    const vegetables = await prisma.vegetable.findMany();
    for(const vegetableitem of vegetables){
        if(vegetableitem.stock <= vegetableitem.threshold){
            await sendEmail(
                process.env.ADMIN_EMAIL,
                "Low Vegetable Stock Alert",
                `Warning!
        vegetable: ${vegetableitem.name} is low in stock.
Current Stock: ${vegetableitem.stock}

Please restock this vegetable.`

            );
        }
    }

    console.log("Low stock check completed.");
  } catch (error) {
    console.error("Error checking low stock:", error);
  }
};