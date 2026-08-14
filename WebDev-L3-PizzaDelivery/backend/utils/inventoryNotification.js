import { prisma } from "../config/db.js";
import { sendEmail } from "./email.js";

export const checkLowStock = async (usedInventory) => {
  try {

    // --------------------------
    // Check regular pizzas
    // --------------------------
    for (const pizzaId of usedInventory.pizzaIds) {

      const pizza = await prisma.pizza.findUnique({
        where: {
          id: pizzaId,
        },
      });

      if (pizza && pizza.stock <= pizza.threshold) {

        await sendEmail(
          process.env.ADMIN_EMAIL,
          "Low Pizza Stock Alert",
          `Warning!

Pizza: ${pizza.name} is low in stock.
Current Stock: ${pizza.stock}

Please restock this pizza.`
        );

      }
    }


    // --------------------------
    // Check pizza bases
    // --------------------------
    for (const baseId of usedInventory.baseIds) {

      const base = await prisma.pizzaBase.findUnique({
        where: {
          id: baseId,
        },
      });

      if (base && base.stock <= base.threshold) {

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


    // --------------------------
    // Check sauces
    // --------------------------
    for (const sauceId of usedInventory.sauceIds) {

      const sauce = await prisma.sauce.findUnique({
        where: {
          id: sauceId,
        },
      });

      if (sauce && sauce.stock <= sauce.threshold) {

        await sendEmail(
          process.env.ADMIN_EMAIL,
          "Low Sauce Stock Alert",
          `Warning!

Sauce: ${sauce.name} is low in stock.
Current Stock: ${sauce.stock}

Please restock this sauce.`
        );

      }
    }


    // --------------------------
    // Check cheeses
    // --------------------------
    for (const cheeseId of usedInventory.cheeseIds) {

      const cheese = await prisma.cheese.findUnique({
        where: {
          id: cheeseId,
        },
      });

      if (cheese && cheese.stock <= cheese.threshold) {

        await sendEmail(
          process.env.ADMIN_EMAIL,
          "Low Cheese Stock Alert",
          `Warning!

Cheese: ${cheese.name} is low in stock.
Current Stock: ${cheese.stock}

Please restock this cheese.`
        );

      }
    }


    // --------------------------
    // Check vegetables
    // --------------------------
    for (const vegetableId of usedInventory.vegetableIds) {

      const vegetable = await prisma.vegetable.findUnique({
        where: {
          id: vegetableId,
        },
      });

      if (vegetable && vegetable.stock <= vegetable.threshold) {

        await sendEmail(
          process.env.ADMIN_EMAIL,
          "Low Vegetable Stock Alert",
          `Warning!

Vegetable: ${vegetable.name} is low in stock.
Current Stock: ${vegetable.stock}

Please restock this vegetable.`
        );

      }
    }

    console.log("Low stock check completed.");

  } catch (error) {

    console.error("Error checking low stock:", error);

  }
};