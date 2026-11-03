import { createUser, getUser, logoutCurrentUser } from "../services/userService.js";
import bcrypt from "bcryptjs";
import { generateTokens } from "../utils/generateTokens.js";
import jwt from 'jsonwebtoken';


async function registerUser(req, res){
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

        const existingUser = await getUser({email:normalizeEmail})

        if (existingUser){
            return res.status(400).json({
                message:"An account with this email already exists.",
            }); 
        }
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = {
            username: username,
            email: email,
            passwordHash
        }
        
        const newUser = await createUser(user); 

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
}

async function loginUser(req, res){
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

        const user = await getUser({email: email.trim().toLowerCase()}, true)
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

        const tokes = generateTokens(user)

        const {accessToken, refreshToken } = tokes

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        })

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
}

async function getCurrentUser(req, res) {
    const id = req.user.sub;
    console.log(id)
    if(!id) return res.status(404).json({
        message: "User not found" 
    });

    const user = await getUser({_id:id})
    console.log(user)

    if (!user) return res.status(404).json({
        message: 'No user Found'
    });

    return res.status(200).json({
        message: "success",
        user:user
    });
}

async function logoutUser(req, res) {
    try {
        const { jti, exp } = req.user;

        await logoutCurrentUser(jti, exp)

        return res.status(200).json({
            success: true,
            message: "Logout successful.",
        });

    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to logout.",
        });
    }
}

async function refreshUserToken(req, res) {
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

        const user = await getUser({_id: decoded.sub})

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
}

export {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    refreshUserToken
}