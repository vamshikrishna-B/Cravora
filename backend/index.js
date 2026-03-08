import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectdb from "./config/db.js";
import cookieParser from 'cookie-parser';
import authrouter from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",authrouter);
app.listen(PORT, () => {
    connectdb()
    console.log(`Server is running on port ${PORT}`);
});
