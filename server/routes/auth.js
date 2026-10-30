import express from 'express';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authToken from '../middleware/authToken.middleware.js';
import 'dotenv/config';

const auth = express.Router();

auth.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (
            typeof username !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Name, email, and password are required.",
        });
        }

        if(password.length < 8 || password.length > 72){
            return res.status(400).json({
                message: "Password must be between 8 and 72 characters."
            }); 
        }

        const normalizeEmail = email.trim().toLocaleLowerCase();

        const existingUser = await User.findOne({
            email:normalizeEmail
        })

        if (existingUser){
            return res.status(400).json({
                message:"An account with this email already exists.",
            }); 
        }
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        

        const newUser = new User({
            username,
            email,
            passwordHash,
        });

        await newUser.save();

        return res.status(201).json({
        message: "Registration successful.",
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
        });
    } catch (error) {
        console.error(error)
        if (error.code === 11000) {
        return res.status(409).json({
            message: "An account with this email already exists.",
            error: error
        });
        }

        console.error("Registration error:", error);

        return res.status(500).json({
        message: "An unexpected error occurred.",
        });       
    }

})

auth.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and password are required.",
        });
        }

        const user = await User.findOne({email:email.trim().toLowerCase()}).select('+passwordHash');

        if(!user) return res.status(401).json({
            message: "User not Found",
        });

        const isMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!isMatch) return res.status(401).json({
            message: "Invalid Email or Password"
        })

        if (!process.env.JWT_SECRET_TOKEN) {
            throw new Error("JWT_SECRET_TOKEN is not configured.");
        }

        const accessToken = jwt.sign(
            {sub: user._id.toString()}, 
            process.env.JWT_SECRET_TOKEN,
            {
                expiresIn: "15m",
                algorithm: "HS256"
            }
        );

        res.status(200).json({
            message: 'Login successful.',
            token: accessToken,
            user:{
                id: user._id,
                user: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "An unexpected error occurred."
        });        
    }
})

auth.get('/me', authToken, async (req, res) => {
    const id = req.user.sub;

    if(!id) return res.status(404).json({
        message: "User not found" 
    });

    const user = await User.findById(id);

    if (!user) return res.status(404).json({
        message: 'No user Found'
    });

    return res.status(200).json({
        message: "success",
        user
    });
})

export default auth