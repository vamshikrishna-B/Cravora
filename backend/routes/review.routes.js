import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createReview,
  getRestaurantReviews
} from "../controllers/review.controller.js";

const reviewRouter = express.Router();

reviewRouter.route("/")
  .post(protect, createReview);

reviewRouter.route("/restaurant/:restaurantId")
  .get(getRestaurantReviews);

export default reviewRouter;
