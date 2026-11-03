import express from 'express';
import authToken from '../middleware/authToken.middleware.js';
import 'dotenv/config';
import { getCurrentUser, loginUser, logoutUser, registerUser, refreshUserToken } from '../contorllers/authController.js';

const auth = express.Router();

auth.post('/register', registerUser)

auth.post('/login', loginUser)

auth.get('/me', authToken, getCurrentUser)

auth.post("/logout", authToken, logoutUser);

auth.post('/refresh', refreshUserToken)

export default auth