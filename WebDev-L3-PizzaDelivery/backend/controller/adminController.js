import { prisma } from "../config/db.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const totalOrders = await prisma.order.count();

    const totalUsers = await prisma.user.count();

    const totalPizzas = await prisma.pizza.count();

    const orders = await prisma.order.findMany({
      select: {
        totalAmount: true,
      },
    });

    const totalSales = orders.reduce(
      (total, order) => total + Number(order.totalAmount),
      0
    );

    res.status(200).json({
      totalOrders,
      totalUsers,
      totalPizzas,
      totalSales,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};