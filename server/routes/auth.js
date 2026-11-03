import express from 'express';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import authToken from '../middleware/authToken.middleware.js';
import { generateTokens } from '../utils/generateTokens.js';
import 'dotenv/config';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../contorllers/authController.js';

const auth = express.Router();

auth.post('/register', registerUser)

auth.post('/login', loginUser)

auth.get('/me', authToken, getCurrentUser)

auth.post("/logout", authToken, logoutUser);

auth.post('/refresh', async (req ,res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            return res.status(401).json({
                message: "Refresh token missing."
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN
        );

        const user = await User.findById(decoded.sub);

        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }
        const newToken = generateTokens(user);
        return res.status(200).json({
            token: newToken.accessToken
        });      
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired refresh token."
        });
    }
})

export default auth