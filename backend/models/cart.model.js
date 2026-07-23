import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity can not be less than 1"],
        default: 1,
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  }
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
