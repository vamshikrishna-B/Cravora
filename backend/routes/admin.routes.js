import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  createCoupon,
  getCoupons,
  deleteCoupon,
  validateCoupon,
  createBanner,
  getBanners,
  deleteBanner,
  getAnalytics,
  getUsers,
  updateUserRole
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// Coupons
adminRouter.route("/coupons")
  .post(protect, authorize("owner"), createCoupon)
  .get(protect, getCoupons);

adminRouter.route("/coupons/validate")
  .post(protect, validateCoupon);   // Any logged-in user can validate a coupon at checkout

adminRouter.route("/coupons/:id")
  .delete(protect, authorize("owner"), deleteCoupon);

// Banners
adminRouter.route("/banners")
  .post(protect, authorize("owner"), createBanner)
  .get(getBanners);

adminRouter.route("/banners/:id")
  .delete(protect, authorize("owner"), deleteBanner);

// Analytics
adminRouter.route("/analytics")
  .get(protect, authorize("owner"), getAnalytics);

// User Management
adminRouter.route("/users")
  .get(protect, authorize("owner"), getUsers);

adminRouter.route("/users/:id/role")
  .put(protect, authorize("owner"), updateUserRole);

export default adminRouter;

