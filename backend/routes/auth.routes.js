import express from 'express';
import { signup } from "../controllers/auth.js";
import { signin } from "../controllers/auth.js";
import { signout } from "../controllers/auth.js";
const authrouter = express.Router();

authrouter.post('/signup', signup);
authrouter.post('/signin', signin);
authrouter.get('/signout', signout);

export default authrouter;