import Review from "../models/review.model.js";
import Restaurant from "../models/restaurant.model.js";

export const createReview = async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;
    if (!restaurantId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const review = await Review.create({
      user: req.user._id,
      restaurant: restaurantId,
      rating: Number(rating),
      comment
    });

    // Update average rating for the restaurant
    const reviews = await Review.find({ restaurant: restaurantId });
    const numReviews = reviews.length;
    const avgRating = reviews.reduce((sum, item) => sum + item.rating, 0) / numReviews;

    restaurant.rating = Number(avgRating.toFixed(1));
    restaurant.numReviews = numReviews;
    await restaurant.save();

    return res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create review" });
  }
};

export const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId })
      .populate("user", "fullname")
      .sort({ createdAt: -1 });
    return res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to retrieve reviews" });
  }
};
