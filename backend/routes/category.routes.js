import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.route("/")
  .post(protect, authorize("owner"), createCategory)
  .get(getCategories);

categoryRouter.route("/:id")
  .put(protect, authorize("owner"), updateCategory)
  .delete(protect, authorize("owner"), deleteCategory);

// Image upload endpoint
categoryRouter.post("/:id/image", protect, authorize("owner"), upload.single("image"), async (req, res) => {
  try {
    const Category = (await import("../models/category.model.js")).default;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    category.image = `/uploads/${req.file.filename}`;
    await category.save();
    return res.status(200).json({ image: category.image });
  } catch (error) {
    res.status(500).json({ message: error.message || "Image upload failed" });
  }
});

export default categoryRouter;
