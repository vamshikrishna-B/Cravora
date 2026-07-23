import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant
} from "../controllers/restaurant.controller.js";

const restaurantRouter = express.Router();

restaurantRouter.route("/")
  .post(protect, authorize("owner"), createRestaurant)
  .get(getRestaurants);

restaurantRouter.route("/:id")
  .get(getRestaurantById)
  .put(protect, authorize("owner"), updateRestaurant)
  .delete(protect, authorize("owner"), deleteRestaurant);

// Image upload endpoint
restaurantRouter.post("/:id/image", protect, authorize("owner"), upload.single("image"), async (req, res) => {
  try {
    const Restaurant = (await import("../models/restaurant.model.js")).default;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    restaurant.image = `/uploads/${req.file.filename}`;
    await restaurant.save();
    return res.status(200).json({ image: restaurant.image });
  } catch (error) {
    res.status(500).json({ message: error.message || "Image upload failed" });
  }
});

export default restaurantRouter;
