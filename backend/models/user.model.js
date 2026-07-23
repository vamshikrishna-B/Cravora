import mongoose from "mongoose";

const savedAddressSchema = new mongoose.Schema({
    label: { type: String, default: "Home" },  // Home, Work, Other
    address: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
}, { _id: true });

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "owner", "deliveryboy"],
        required: true
    },
    avatar: {
        type: String,
        default: ""
    },
    savedAddresses: [savedAddressSchema],
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food"
        }
    ]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;