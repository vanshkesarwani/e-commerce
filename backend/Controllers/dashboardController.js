import { Order } from "../Models/orderModel.js";
import { Product } from "../Models/productModel.js";
import { User } from "../Models/userModel.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

// ==========================================
// EXECUTIVE ADMIN DASHBOARD ANALYTICS CONTROLLER
// Aggregates real-time KPIs, revenue trends, inventory alerts, and order funnel
// ==========================================

export const getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  // 1. Fetch all orders, products, and users concurrently
  const [orders, products, users] = await Promise.all([
    Order.find().sort({ createdAt: -1 }),
    Product.find().select("title price stock category productImage numOfReviews ratings createdAt").sort({ createdAt: -1 }),
    User.find().select("name email role photo createdAt").sort({ createdAt: -1 }),
  ]);

  // 2. High-level KPIs
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalUsers = users.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // 3. User distribution
  const adminCount = users.filter((u) => u.role === "admin").length;
  const customerCount = totalUsers - adminCount;

  // 4. Order status breakdown
  const orderStatusCounts = {
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  orders.forEach((order) => {
    const status = order.orderStatus || "Processing";
    if (orderStatusCounts[status] !== undefined) {
      orderStatusCounts[status]++;
    } else {
      orderStatusCounts.Processing++;
    }
  });

  // 5. Inventory health & low-stock alerts (stock <= 5)
  const lowStockThreshold = 5;
  const lowStockProducts = products.filter((p) => (p.stock || 0) <= lowStockThreshold);
  const outOfStockCount = products.filter((p) => (p.stock || 0) <= 0).length;
  const inStockCount = totalProducts - outOfStockCount;

  // 6. Category breakdown
  const categoryMap = {};
  products.forEach((p) => {
    const cat = p.category || "Uncategorized";
    if (!categoryMap[cat]) {
      categoryMap[cat] = { category: cat, count: 0, totalStock: 0 };
    }
    categoryMap[cat].count++;
    categoryMap[cat].totalStock += p.stock || 0;
  });
  const categoryBreakdown = Object.values(categoryMap).sort((a, b) => b.count - a.count);

  // 7. Last 7 Days Revenue & Order volume trend
  const now = new Date();
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const nextD = new Date(d);
    nextD.setDate(nextD.getDate() + 1);

    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const formattedDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const dayOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= d && orderDate < nextD;
    });

    const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    last7Days.push({
      day: dayName,
      date: formattedDate,
      revenue: Math.round(dayRevenue),
      orders: dayOrders.length,
    });
  }

  // 8. Recent 6 Orders populated with customer and basic details
  const recentOrders = orders.slice(0, 6).map((order) => {
    const userDetail = users.find((u) => u._id.toString() === order.user?.toString());
    return {
      _id: order._id,
      customerName: userDetail ? userDetail.name : "Guest / Customer",
      customerEmail: userDetail ? userDetail.email : "N/A",
      orderStatus: order.orderStatus,
      totalPrice: order.totalPrice,
      itemsCount: order.orderItems?.length || 0,
      createdAt: order.createdAt,
      paidAt: order.paidAt,
      firstItemImage: order.orderItems?.[0]?.image || "",
    };
  });

  // 9. Recent 5 Customers
  const recentCustomers = users.slice(0, 5).map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    photo: user.photo?.url || "",
    createdAt: user.createdAt,
  }));

  res.status(200).json({
    success: true,
    data: {
      kpis: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        averageOrderValue,
        adminCount,
        customerCount,
        inStockCount,
        outOfStockCount,
        lowStockCount: lowStockProducts.length,
      },
      orderStatusCounts,
      salesTrend: last7Days,
      categoryBreakdown,
      lowStockProducts: lowStockProducts.slice(0, 8),
      recentOrders,
      recentCustomers,
    },
  });
});
