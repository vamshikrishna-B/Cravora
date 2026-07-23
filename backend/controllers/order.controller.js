import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Food from "../models/food.model.js";

export const createOrder = async (req, res) => {
  try {
    const { deliveryAddress, paymentMethod, paymentId } = req.body;
    if (!deliveryAddress || !paymentMethod) {
      return res.status(400).json({ message: "Delivery address and payment method are required" });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.food");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // Determine the restaurant from the first item
    const firstFood = await Food.findById(cart.items[0].food._id);
    if (!firstFood) {
      return res.status(400).json({ message: "Invalid items in cart" });
    }
    const restaurantId = firstFood.restaurant;

    const orderItems = [];
    for (const item of cart.items) {
      orderItems.push({
        food: item.food._id,
        name: item.food.name,
        quantity: item.quantity,
        price: item.food.price
      });
    }

    let paymentStatus = "Pending";
    if (paymentMethod === "Stripe") {
      // Simulate/mock successful Stripe payment
      paymentStatus = "Paid";
    }

    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurantId,
      items: orderItems,
      totalAmount: cart.totalPrice,
      deliveryAddress,
      paymentMethod,
      paymentStatus
    });

    // Clear the cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("restaurant", "name image address")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to retrieve orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "fullname email mobile")
      .populate("restaurant", "name image address");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify ownership
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "owner" &&
      req.user.role !== "deliveryboy"
    ) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch order details" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    return res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update order status" });
  }
};

export const getRestaurantOrders = async (req, res) => {
  try {
    // Find all orders for restaurants owned by the current owner user
    const orders = await Order.find()
      .populate({
        path: "restaurant",
        match: { owner: req.user._id }
      })
      .populate("user", "fullname email mobile")
      .sort({ createdAt: -1 });

    // Filter out orders that didn't match the restaurant ownership
    const ownerOrders = orders.filter(order => order.restaurant !== null);
    return res.status(200).json(ownerOrders);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to retrieve restaurant orders" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullname email")
      .populate("restaurant", "name")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch all orders" });
  }
};
