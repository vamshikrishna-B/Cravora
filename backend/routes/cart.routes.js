import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.use(protect);

cartRouter.route("/")
  .get(getCart)
  .post(addToCart)
  .put(updateCartItem)
  .delete(clearCart);

cartRouter.route("/:foodId")
  .delete(removeFromCart);

export default cartRouter;
