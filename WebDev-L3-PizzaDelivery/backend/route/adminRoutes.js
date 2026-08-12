import express from "express";

import { authMiddleware } from "../middleware/authmiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { getAdminDashboard } from "../controller/adminController.js";

const adminRouter = express.Router();

adminRouter.get(
  "/admin/dashboard",
  authMiddleware,
  adminMiddleware,
  getAdminDashboard
    );

export default adminRouter;