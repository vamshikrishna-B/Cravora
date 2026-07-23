import Coupon from "../models/coupon.model.js";
import Banner from "../models/banner.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

// --- Coupon Management ---
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expirationDate } = req.body;
    if (!code || !discountType || !discountValue || !expirationDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: "Coupon already exists" });
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      expirationDate
    });

    return res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create coupon" });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    return res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch coupons" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    await coupon.deleteOne();
    return res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete coupon" });
  }
};

// Validate / Apply a coupon code (called during checkout by any logged-in user)
export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ message: "Coupon code is required" });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: "Invalid or inactive coupon code" });

    // Check expiry
    if (new Date() > new Date(coupon.expirationDate)) {
      return res.status(400).json({ message: "This coupon has expired" });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = ((cartTotal || 0) * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    const finalAmount = Math.max(0, (cartTotal || 0) - discountAmount);

    return res.status(200).json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      },
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      finalAmount: parseFloat(finalAmount.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to validate coupon" });
  }
};


// --- Banner Management ---
export const createBanner = async (req, res) => {
  try {
    const { image, title, description } = req.body;
    if (!image || !title) {
      return res.status(400).json({ message: "Image and title are required" });
    }

    const banner = await Banner.create({ image, title, description });
    return res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to create banner" });
  }
};

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    return res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch banners" });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    await banner.deleteOne();
    return res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete banner" });
  }
};

// --- Sales Analytics ---
export const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.find({ orderStatus: "Delivered" });
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const totalUsers = await User.countDocuments();
    const customerCount = await User.countDocuments({ role: "user" });
    const ownerCount = await User.countDocuments({ role: "owner" });
    const deliveryCount = await User.countDocuments({ role: "deliveryboy" });

    return res.status(200).json({
      totalOrders,
      totalRevenue,
      totalUsers,
      rolesBreakdown: {
        customerCount,
        ownerCount,
        deliveryCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch analytics" });
  }
};

// --- User Management ---
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch users" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "owner", "deliveryboy"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update user role" });
  }
};
