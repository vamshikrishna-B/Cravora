import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// --- Get Profile ---
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("wishlist", "name price image");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch profile" });
  }
};

// --- Update Profile (name, mobile, avatar) ---
export const updateProfile = async (req, res) => {
  try {
    const { fullname, mobile } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullname) user.fullname = fullname;
    if (mobile) {
      if (mobile.length !== 10) {
        return res.status(400).json({ message: "Mobile number must be 10 digits" });
      }
      user.mobile = mobile;
    }

    // If a file was uploaded via Multer
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();
    const { password: _pw, ...userWithoutPassword } = user.toObject();
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update profile" });
  }
};

// --- Change Password ---
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to change password" });
  }
};

// --- Saved Addresses ---
export const getSavedAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("savedAddresses");
    return res.status(200).json(user.savedAddresses);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch addresses" });
  }
};

export const addSavedAddress = async (req, res) => {
  try {
    const { label, address, isDefault } = req.body;
    if (!address) return res.status(400).json({ message: "Address is required" });

    const user = await User.findById(req.user._id);

    // If new address is set as default, unset all others
    if (isDefault) {
      user.savedAddresses.forEach(addr => { addr.isDefault = false; });
    }

    user.savedAddresses.push({ label: label || "Home", address, isDefault: isDefault || false });
    await user.save();
    return res.status(201).json(user.savedAddresses);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to add address" });
  }
};

export const updateSavedAddress = async (req, res) => {
  try {
    const { label, address, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    const addr = user.savedAddresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });

    if (isDefault) {
      user.savedAddresses.forEach(a => { a.isDefault = false; });
    }

    if (label) addr.label = label;
    if (address) addr.address = address;
    if (isDefault !== undefined) addr.isDefault = isDefault;

    await user.save();
    return res.status(200).json(user.savedAddresses);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update address" });
  }
};

export const deleteSavedAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.savedAddresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: "Address not found" });

    addr.deleteOne();
    await user.save();
    return res.status(200).json({ message: "Address removed", addresses: user.savedAddresses });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete address" });
  }
};
