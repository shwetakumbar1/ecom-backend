const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
require("dotenv").config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Create Razorpay order
    const options = {
      amount: cart.totalPrice * 100, // amount in paise
      currency: "INR",
      receipt: `rcptid_${Date.now()}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // Save order in DB with status pending
    const order = new Order({
      userId,
      products: cart.products,
      totalPrice: cart.totalPrice,
      paymentStatus: "pending",
      orderStatus: "processing",
      orderId: razorpayOrder.id,
      receipt: razorpayOrder.receipt,
    });
    await order.save();

    res.status(201).json({
      success: true,
      order,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      message: "Error creating Razorpay order",
    });
  }
};

// Verify payment (client sends payment_id, order_id, signature)
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const orderId = razorpay_order_id;
    const paymentId = razorpay_payment_id;
    const signature = razorpay_signature;

    // Validate the signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({
        message: "Invalid signature",
      });
    }

    // Update order status
    const order = await Order.findOneAndUpdate(
      { orderId },
      { paymentStatus: "paid", paymentId },
      { new: true }
    );

    // Optionally, clear user's cart
    await Cart.findOneAndUpdate(
      { userId: order.userId },
      { products: [], totalPrice: 0 }
    );

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      message: "Error verifying payment",
    });
  }
};

// Razorpay webhook handler
const razorpayWebhook = async (req, res) => {
  // Razorpay sends the signature in headers
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];
  const body = JSON.stringify(req.body);

  // Verify signature
  const generatedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (generatedSignature !== signature) {
    return res.status(400).json({
      message: "Invalid signature",
    });
  }

  // Handle payment events
  const event = req.body.event;
  const payload = req.body.payload;

  if (event === "payment.captured") {
    const paymentEntity = payload.payment.entity;
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;

    // Update order in DB
    await Order.findOneAndUpdate(
      { orderId },
      { paymentStatus: "paid", paymentId },
      { new: true }
    );

    // Optionally, clear user's cart
    const order = await Order.findOne({ orderId });
    await Cart.findOneAndUpdate(
      { userId: order.userId },
      { products: [], totalPrice: 0 }
    );
  } else if (event === "payment.failed") {
    const paymentEntity = payload.payment.entity;
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;

    await Order.findOneAndUpdate(
      { orderId },
      { paymentStatus: "failed", paymentId },
      { new: true }
    );
  }

  res.status(200).json({ status: "ok" });
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  razorpayWebhook,
};