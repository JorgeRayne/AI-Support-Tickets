import express from 'express';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

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

auth.get('/users', async (req, res) => {
    
    const user = await User.find();
    return res.json(user)
})

export default auth