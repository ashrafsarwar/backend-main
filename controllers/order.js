import { Order } from "../models/order.js";
import { User } from "../models/user.js";
import Stripe from "stripe";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const order = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice, userId } = req.body;

    const newOrder = new Order({
      orderItems,
      shippingAddress,
      totalPrice,
      user: userId,
      paidAt: new Date(),
    });
    await newOrder.save();

    // Stripe session creation
    const session = await createStripeSession(orderItems, newOrder._id);

    res.send({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error creating order:", error);

    // Send detailed error response
    res.status(500).send({
      success: false,
      message: error.message,
      details: error.raw || error,
    });
  }
};

const deleteAll = async (req, res) => {
  try {
    const result = await Order.deleteMany({});
    res.send("All orders deleted successfully.");
  } catch (err) {
    res.status(500).send(`Error deleting orders: ${err.message}`);
  }
};

// Function to create a Stripe session
const createStripeSession = async (orderItems, orderId) => {
  try {
    const frontend_url = "https://ecommerce-frontend-sooty-eta.vercel.app/"; // Replace with your frontend URL

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: orderItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.nameProduct,
          },
          unit_amount: item.price * 100, // Ensure price is in cents
        },
        quantity: item.quantity, // Correct quantity
      })),
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${orderId}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${orderId}`,
    });

    return session;
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    throw error; // Re-throw error to be caught in the main function
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, isDelivered } = req.body;
    const order = await Order.findById(orderId);
    console.log(isDelivered);
    if (!order) {
      return res.send({ success: false, message: "Order not found" });
    }
    order.isDelivered = isDelivered;
    await order.save();
    res.send({ success: true });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.send({ success: false, message: error.message });
  }
};

const getOrdersOfUser = async (req, res) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.send({ success: false, message: "Token not found" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const orders = await Order.find({ user: userId });

    res.send({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.send({ success: false, message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.send({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.send({ success: false, message: error.message });
  }
};

export { order, getOrders, updateOrderStatus, deleteAll, getOrdersOfUser };
