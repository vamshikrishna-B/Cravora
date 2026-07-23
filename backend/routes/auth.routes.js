import express from 'express';
import { signup, signin, signout, getMe } from "../controllers/auth.js";
import { protect } from "../middlewares/auth.middleware.js";

const authrouter = express.Router();

authrouter.post('/signup', signup);
authrouter.post('/signin', signin);
authrouter.get('/signout', signout);
authrouter.get('/me', protect, getMe);

export default authrouter;