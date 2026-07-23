import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood
} from "../controllers/food.controller.js";

const foodRouter = express.Router();

foodRouter.route("/")
  .post(protect, authorize("owner"), createFood)
  .get(getFoods);

foodRouter.route("/:id")
  .get(getFoodById)
  .put(protect, authorize("owner"), updateFood)
  .delete(protect, authorize("owner"), deleteFood);

// Image upload endpoint
foodRouter.post("/:id/image", protect, authorize("owner"), upload.single("image"), async (req, res) => {
  try {
    const Food = (await import("../models/food.model.js")).default;
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    food.image = `/uploads/${req.file.filename}`;
    await food.save();
    return res.status(200).json({ image: food.image });
  } catch (error) {
    res.status(500).json({ message: error.message || "Image upload failed" });
  }
});

export default foodRouter;
