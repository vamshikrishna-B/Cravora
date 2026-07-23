import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }
    const category = await Category.create({ name, image });
    return res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create category" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    return res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch categories" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, image, isActive } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) category.name = name;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    return res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update category" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await category.deleteOne();
    return res.status(200).json({ message: "Category removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete category" });
  }
};
