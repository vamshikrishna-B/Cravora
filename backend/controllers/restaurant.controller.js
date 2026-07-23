import Restaurant from "../models/restaurant.model.js";

export const createRestaurant = async (req, res) => {
  try {
    const { name, description, cuisine, image, address } = req.body;
    if (!name || !description || !cuisine || !address) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      cuisine: Array.isArray(cuisine) ? cuisine : cuisine.split(",").map(c => c.trim()),
      image,
      address,
      owner: req.user._id
    });

    return res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create restaurant" });
  }
};

export const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: true }).populate("owner", "fullname email");
    return res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch restaurants" });
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate("owner", "fullname email");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    return res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch restaurant details" });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { name, description, cuisine, image, address, isActive } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if req.user is the owner
    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this restaurant" });
    }

    if (name) restaurant.name = name;
    if (description) restaurant.description = description;
    if (cuisine) restaurant.cuisine = Array.isArray(cuisine) ? cuisine : cuisine.split(",").map(c => c.trim());
    if (image !== undefined) restaurant.image = image;
    if (address) restaurant.address = address;
    if (isActive !== undefined) restaurant.isActive = isActive;

    await restaurant.save();
    return res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update restaurant" });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this restaurant" });
    }

    await restaurant.deleteOne();
    return res.status(200).json({ message: "Restaurant removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete restaurant" });
  }
};
