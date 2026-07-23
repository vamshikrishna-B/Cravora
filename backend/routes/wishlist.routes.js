import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getWishlist,
  toggleWishlist,
  clearWishlist
} from "../controllers/wishlist.controller.js";

const wishlistRouter = express.Router();

wishlistRouter.use(protect);

wishlistRouter.route("/")
  .get(getWishlist)
  .delete(clearWishlist);

wishlistRouter.route("/:foodId")
  .put(toggleWishlist);  // PUT /api/wishlist/:foodId  → adds or removes

export default wishlistRouter;
