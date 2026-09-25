import { Order } from "../Models/orderModel.js";
import { Product } from "../Models/productModel.js";
import ErrorHander from "../middleware/errorhander.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import mongoose from "mongoose";

// ==========================================
// 1. CREATE NEW ORDER
// ==========================================
/**
 * Create a new customer order
 */
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHander("No order items found in request", 400));
  }

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// ==========================================
// 2. GET SINGLE ORDER
// ==========================================
/**
 * Get single order details by ID
 */
export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("Order not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// ==========================================
// 3. GET LOGGED-IN USER ORDERS
// ==========================================
/**
 * Retrieve all orders for a specific user
 */
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.userId || req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, error: "Invalid User ID format" });
  }

  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});

// ==========================================
// 4. GET ALL ORDERS (ADMIN)
// ==========================================
/**
 * Admin: Retrieve all orders across the system
 */
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().sort({ createdAt: -1 });

  const totalAmount = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// ==========================================
// 5. UPDATE ORDER STATUS (ADMIN)
// ==========================================
/**
 * Helper to update product inventory stock safely
 */
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  if (!product) return;

  product.stock = Math.max(0, (product.stock || 0) - quantity);
  await product.save({ validateBeforeSave: false });
}

/**
 * Admin: Update order processing/shipping status
 */
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this ID", 404));
  }

  const newStatus = req.body.status || req.body.orderStatus;
  if (!newStatus) {
    return next(new ErrorHander("Please provide status or orderStatus", 400));
  }

  if (order.orderStatus === "Delivered" && newStatus === "Delivered") {
    return next(new ErrorHander("This order has already been delivered", 400));
  }

  if (newStatus === "Shipped" && order.orderStatus !== "Shipped") {
    for (const item of order.orderItems) {
      await updateStock(item.product, item.quantity);
    }
  }

  order.orderStatus = newStatus;

  if (newStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `Order status updated to ${newStatus}`,
    order,
  });
});

// ==========================================
// 6. DELETE ORDER (ADMIN)
// ==========================================
/**
 * Admin: Delete an order by ID
 */
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

// ==========================================
// 7. REQUEST RETURN OR REPLACEMENT (CUSTOMER)
// ==========================================
export const requestReturnOrReplacement = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { requestType, reason, comments, pickupAddress } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHander("Order not found with this ID", 404));
  }

  // Only delivered orders can be returned or replaced
  if (
    order.orderStatus !== "Delivered" &&
    order.orderStatus !== "Return Requested" &&
    order.orderStatus !== "Replacement Requested"
  ) {
    return next(
      new ErrorHander("Returns or replacements are only eligible for delivered orders", 400)
    );
  }

  if (!reason) {
    return next(new ErrorHander("Please select a reason for return/replacement", 400));
  }

  const type = requestType === "Replacement" ? "Replacement" : "Return";

  order.returnRequest = {
    status: "Requested",
    requestType: type,
    reason,
    comments: comments || "",
    pickupAddress:
      pickupAddress ||
      `${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} - ${order.shippingInfo.pinCode}`,
    requestedAt: Date.now(),
  };

  order.orderStatus = type === "Replacement" ? "Replacement Requested" : "Return Requested";

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: `${type} request submitted successfully. Our courier partner will contact you for pickup.`,
    order,
  });
});

// ==========================================
// 8. CANCEL RETURN / REPLACEMENT REQUEST (CUSTOMER)
// ==========================================
export const cancelReturnRequest = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHander("Order not found", 404));
  }

  order.returnRequest = {
    status: "None",
  };
  order.orderStatus = "Delivered";

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Return or replacement request cancelled successfully.",
    order,
  });
});