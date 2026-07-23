import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import connectdb from "./config/db.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route Imports
import authrouter from "./routes/auth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import restaurantRouter from "./routes/restaurant.routes.js";
import foodRouter from "./routes/food.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import reviewRouter from "./routes/review.routes.js";
import adminRouter from "./routes/admin.routes.js";
import userRouter from "./routes/user.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route Definitions
app.use("/api/auth", authrouter);
app.use("/api/categories", categoryRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/foods", foodRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/wishlist", wishlistRouter);

app.listen(PORT, () => {
    connectdb();
    console.log(`Server is running on port ${PORT}`);
});
