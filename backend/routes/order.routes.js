import express from "express";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getRestaurantOrders,
  getAllOrders
} from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.use(protect);

orderRouter.route("/")
  .post(createOrder)
  .get(getMyOrders);

orderRouter.route("/owner")
  .get(authorize("owner"), getRestaurantOrders);

orderRouter.route("/all")
  .get(authorize("owner"), getAllOrders);

orderRouter.route("/:id")
  .get(getOrderById)
  .put(authorize("owner", "deliveryboy"), updateOrderStatus);

export default orderRouter;
