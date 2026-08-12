import { prisma } from "../config/db.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    // authMiddleware should already have added req.user
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.user.id),
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({
        message: "Admin access required.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);

    res.status(500).json({
      message: "Internal server error.",
    });
  }
};