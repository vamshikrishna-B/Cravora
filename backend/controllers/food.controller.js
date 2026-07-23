import Food from "../models/food.model.js";
import Restaurant from "../models/restaurant.model.js";

export const createFood = async (req, res) => {
  try {
    const { name, description, price, image, category, restaurant } = req.body;
    if (!name || !description || !price || !category || !restaurant) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const restDoc = await Restaurant.findById(restaurant);
    if (!restDoc) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if the current user is the owner of the restaurant
    if (restDoc.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to add food items to this restaurant" });
    }

    const food = await Food.create({
      name,
      description,
      price,
      image,
      category,
      restaurant
    });

    return res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create food item" });
  }
};

export const getFoods = async (req, res) => {
  try {
    const { restaurant, category, search } = req.query;
    const queryObj = { isAvailable: true };

    if (restaurant) queryObj.restaurant = restaurant;
    if (category) queryObj.category = category;
    if (search) {
      queryObj.name = { $regex: search, $options: "i" };
    }

    const foods = await Food.find(queryObj)
      .populate("category", "name")
      .populate("restaurant", "name address");

    return res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch foods" });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate("category", "name")
      .populate("restaurant", "name address");
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }
    return res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch food details" });
  }
};

export const updateFood = async (req, res) => {
  try {
    const { name, description, price, image, category, isAvailable } = req.body;
    const food = await Food.findById(req.params.id).populate("restaurant");
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Check if the current user owns the restaurant that the food belongs to
    if (food.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to update food items for this restaurant" });
    }

    if (name) food.name = name;
    if (description) food.description = description;
    if (price !== undefined) food.price = price;
    if (image !== undefined) food.image = image;
    if (category) food.category = category;
    if (isAvailable !== undefined) food.isAvailable = isAvailable;

    await food.save();
    return res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update food item" });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate("restaurant");
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (food.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete food items from this restaurant" });
    }

    await food.deleteOne();
    return res.status(200).json({ message: "Food item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete food item" });
  }
};
