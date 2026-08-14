import Razorpay from "razorpay";
import { prisma } from "../config/db.js";
import crypto from "crypto";
import { checkLowStock } from "../utils/inventoryNotification.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// =====================================================
// CREATE PAYMENT
// =====================================================

export const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // 1. Find the order
    const order = await prisma.order.findUnique({
      where: {
        id: Number(orderId),
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    // 2. Check order ownership
    if (order.userId !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to pay for this order.",
      });
    }

    // 3. Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: {
        orderId: order.id,
      },
    });

    if (existingPayment) {
      return res.status(400).json({
        message: "Payment already exists for this order.",
      });
    }

    // 4. Convert amount to paise
    const amountInPaise = Math.round(
      order.totalAmount * 100
    );

    if (amountInPaise < 100) {
      return res.status(400).json({
        message: "Payment amount must be at least ₹1.",
      });
    }

    // 5. Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `order_${order.id}`,
    });

    // 6. Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.totalAmount,
        status: "PENDING",
        razorpayId: razorpayOrder.id,
      },
    });

    // 7. Send payment information to frontend
    res.status(201).json({
      message: "Payment created successfully.",

      payment,

      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },

      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Error creating payment:", error);

    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
    });
  }
};


// =====================================================
// VERIFY PAYMENT + REDUCE INVENTORY
// =====================================================

export const verifyPayment = async (req, res) => {
  try {
    const usedInventory = {
  pizzaIds: [],
  baseIds: [],
  sauceIds: [],
  cheeseIds: [],
  vegetableIds: [],
};
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;


    // -----------------------------------------------
    // STEP 1: Validate payment data
    // -----------------------------------------------

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification data is incomplete.",
      });
    }


    // -----------------------------------------------
    // STEP 2: Find payment
    // -----------------------------------------------

    const payment = await prisma.payment.findUnique({
      where: {
        orderId: Number(orderId),
      },
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found.",
      });
    }


    // -----------------------------------------------
    // STEP 3: Find order
    // -----------------------------------------------

    const order = await prisma.order.findUnique({
      where: {
        id: Number(orderId),
      },

      include: {
        items: {
          include: {
            pizza: true,

            customPizza: {
              include: {
                base: true,
                sauce: true,
                cheese: true,
                vegetables: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }


    // -----------------------------------------------
    // STEP 4: Check ownership
    // -----------------------------------------------

    if (order.userId !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to verify this payment.",
      });
    }


    // -----------------------------------------------
    // STEP 5: Check Razorpay order ID
    // -----------------------------------------------

    if (payment.razorpayId !== razorpay_order_id) {
      return res.status(400).json({
        message: "Razorpay order does not match.",
      });
    }


    // -----------------------------------------------
    // STEP 6: Verify Razorpay signature
    // -----------------------------------------------

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");


    if (generatedSignature !== razorpay_signature) {

      await prisma.payment.update({
        where: {
          orderId: Number(orderId),
        },

        data: {
          status: "FAILED",
        },
      });

      return res.status(400).json({
        message: "Payment verification failed.",
      });
    }


    // -----------------------------------------------
    // STEP 7: Make sure payment is not already SUCCESS
    // -----------------------------------------------

    if (payment.status === "SUCCESS") {
      return res.status(400).json({
        message: "Payment has already been verified.",
      });
    }


    // =================================================
    // STEP 8: CHECK INVENTORY AGAIN
    // =================================================

    const transactionResult = await prisma.$transaction(
      async (tx) => {

        // ---------------------------------------------
        // Check and decrease inventory for every item
        // ---------------------------------------------

        for (const item of order.items) {

          // ===========================================
          // REGULAR PIZZA
          // ===========================================

          if (item.pizzaId) {

            const pizza = await tx.pizza.findUnique({
              where: {
                id: item.pizzaId,
              },
            });

            if (!pizza) {
              throw new Error(
                `Pizza with id ${item.pizzaId} not found.`
              );
            }

            // Check stock AGAIN
            if (pizza.stock < item.quantity) {
              throw new Error(
                `${pizza.name} does not have enough stock anymore.`
              );
            }

            // Decrease stock
            await tx.pizza.update({
              where: {
                id: pizza.id,
              },

              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
            usedInventory.pizzaIds.push(pizza.id)
          }


          // ===========================================
          // CUSTOM PIZZA
          // ===========================================

          else if (item.customPizzaId) {

            const customPizza =
              await tx.customPizza.findUnique({
                where: {
                  id: item.customPizzaId,
                },

                include: {
                  base: true,
                  sauce: true,
                  cheese: true,
                  vegetables: true,
                },
              });


            if (!customPizza) {
              throw new Error(
                `Custom pizza with id ${item.customPizzaId} not found.`
              );
            }


            // -----------------------------------------
            // Check BASE
            // -----------------------------------------

            if (
              customPizza.base.stock <
              item.quantity
            ) {
              throw new Error(
                `${customPizza.base.name} does not have enough stock anymore.`
              );
            }


            // -----------------------------------------
            // Check SAUCE
            // -----------------------------------------

            if (
              customPizza.sauce.stock <
              item.quantity
            ) {
              throw new Error(
                `${customPizza.sauce.name} does not have enough stock anymore.`
              );
            }


            // -----------------------------------------
            // Check CHEESE
            // -----------------------------------------

            if (
              customPizza.cheese.stock <
              item.quantity
            ) {
              throw new Error(
                `${customPizza.cheese.name} does not have enough stock anymore.`
              );
            }
           
            // -----------------------------------------
            // Check VEGETABLES
            // -----------------------------------------

            for (
              const vegetable
              of customPizza.vegetables
            ) {

              if (
                vegetable.stock <
                item.quantity
              ) {
                throw new Error(
                  `${vegetable.name} does not have enough stock anymore.`
                );
              }
            }


            // -----------------------------------------
            // Decrease BASE
            // -----------------------------------------

            await tx.pizzaBase.update({
              where: {
                id: customPizza.baseId,
              },

              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });


            // -----------------------------------------
            // Decrease SAUCE
            // -----------------------------------------

            await tx.sauce.update({
              where: {
                id: customPizza.sauceId,
              },

              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });


            // -----------------------------------------
            // Decrease CHEESE
            // -----------------------------------------

            await tx.cheese.update({
              where: {
                id: customPizza.cheeseId,
              },

              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });
             usedInventory.baseIds.push(customPizza.baseId);
            usedInventory.sauceIds.push(customPizza.sauceId);
            usedInventory.cheeseIds.push(customPizza.cheeseId);
            // -----------------------------------------
            // Decrease VEGETABLES
            // -----------------------------------------

            for (
              const vegetable
              of customPizza.vegetables
            ) {

              await tx.vegetable.update({
                where: {
                  id: vegetable.id,
                },

                data: {
                  stock: {
                    decrement: item.quantity,
                  },
                },
              });
              usedInventory.vegetableIds.push(vegetable.id);
            }
          }
        }


        // ---------------------------------------------
        // STEP 9: Update payment to SUCCESS
        // ---------------------------------------------

        const updatedPayment =
          await tx.payment.update({
            where: {
              orderId: Number(orderId),
            },

            data: {
              status: "SUCCESS",
            },
          });


        return updatedPayment;
      }
    );


    // -----------------------------------------------
    // STEP 10: Check low stock AFTER deduction
    // -----------------------------------------------

    await checkLowStock(usedInventory);


    // -----------------------------------------------
    // STEP 11: Send response
    // -----------------------------------------------

    res.status(200).json({
      message: "Payment verified successfully.",
      payment: transactionResult,
    });


  } catch (error) {

    console.error(
      "Error verifying payment:",
      error
    );

    // If inventory was insufficient, payment should
    // NOT be marked SUCCESS because the transaction
    // was rolled back.

    res.status(400).json({
      message: error.message,
    });
  }
};