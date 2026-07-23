import Cart from "../models/cart.model.js";
import Food from "../models/food.model.js";

const calculateCartTotal = async (cart) => {
  let totalPrice = 0;
  for (const item of cart.items) {
    const food = await Food.findById(item.food);
    if (food) {
      totalPrice += food.price * item.quantity;
    }
  }
  cart.totalPrice = totalPrice;
  return cart;
};

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.food");
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], totalPrice: 0 });
    }
    return res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { foodId, quantity = 1 } = req.body;
    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], totalPrice: 0 });
    }

    const existingIndex = cart.items.findIndex(item => item.food.toString() === foodId);
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({ food: foodId, quantity: Number(quantity) });
    }

    await calculateCartTotal(cart);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.food");
    return res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to add to cart" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    if (!foodId || quantity === undefined) {
      return res.status(400).json({ message: "Food ID and quantity are required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    await calculateCartTotal(cart);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.food");
    return res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update cart item" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;
    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.food.toString() !== foodId);

    await calculateCartTotal(cart);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.food");
    return res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to remove item from cart" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }
    return res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to clear cart" });
  }
};
