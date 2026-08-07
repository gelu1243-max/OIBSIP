import express from "express";
import {checkLowStock} from "../utils/inventoryNotification.js";

const testrouter = express.Router();

testrouter.get("/test-low-stock", async (req, res) => {
   try {
    await checkLowStock();

    res.status(200).json({
      message: "Low stock check completed",
    });
  } catch (error) {
    console.error("Low stock check error:", error);

    res.status(500).json({
      message: "Failed to check low stock",
      error: error.message,
    });
  }
});

export default testrouter;