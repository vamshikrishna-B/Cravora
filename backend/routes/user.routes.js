import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  getSavedAddresses,
  addSavedAddress,
  updateSavedAddress,
  deleteSavedAddress
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.use(protect);

// Profile
userRouter.route("/profile")
  .get(getProfile)
  .put(upload.single("avatar"), updateProfile);

// Password
userRouter.put("/change-password", changePassword);

// Saved Addresses
userRouter.route("/addresses")
  .get(getSavedAddresses)
  .post(addSavedAddress);

userRouter.route("/addresses/:addressId")
  .put(updateSavedAddress)
  .delete(deleteSavedAddress);

export default userRouter;
