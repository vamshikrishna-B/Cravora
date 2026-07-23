import User from "../models/user.model.js";
import Food from "../models/food.model.js";

// Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "wishlist",
      populate: [
        { path: "category", select: "name" },
        { path: "restaurant", select: "name address" }
      ]
    });
    return res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch wishlist" });
  }
};

// Toggle Wishlist — adds if not in wishlist, removes if already in it
export const toggleWishlist = async (req, res) => {
  try {
    const { foodId } = req.params;

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: "Food item not found" });

    const user = await User.findById(req.user._id);
    const alreadyInWishlist = user.wishlist.some(id => id.toString() === foodId);

    if (alreadyInWishlist) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== foodId);
      await user.save();
      return res.status(200).json({ message: "Removed from wishlist", inWishlist: false, wishlist: user.wishlist });
    } else {
      user.wishlist.push(foodId);
      await user.save();
      return res.status(200).json({ message: "Added to wishlist", inWishlist: true, wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update wishlist" });
  }
};

// Clear entire wishlist
export const clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = [];
    await user.save();
    return res.status(200).json({ message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to clear wishlist" });
  }
};
