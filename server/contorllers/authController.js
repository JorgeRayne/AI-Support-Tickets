import { createUser, getUser, logoutCurrentUser } from "../services/userService.js";
import bcrypt from "bcryptjs";
import { generateTokens } from "../utils/generateTokens.js";
import jwt from 'jsonwebtoken';


async function registerUser(req, res, next){
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
            const error = new Error("Name, email, and password are required.");
            error.statusCode = 400;

            throw error;
        }

        if(password.length < 8 || password.length > 72){
            const error = new Error("Password must be between 8 and 72 characters.");
            error.statusCode = 400;

            throw error;
        }

        const normalizeEmail = email.trim().toLocaleLowerCase();

        const existingUser = await getUser({email:normalizeEmail})

        if (existingUser){
            const error = new Error("An account with this email already exists.");
            error.statusCode = 400;

            throw error;
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
        return next(error);      
    }
}

async function loginUser(req, res, next ){
    try {
        const {email, password} = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            const error = new Error("Email and password are required.");
            error.statusCode = 400;

            throw error;
        }

        const user = await getUser({email: email.trim().toLowerCase()}, true)
        if(!user) {
            const error = new Error("User not Found");
            error.statusCode = 401;

            throw error;
        };

        const isMatch = await bcrypt.compare(
            password, 
            user.passwordHash
        );

        if (!isMatch) {
            const error = new Error("Invalid Email or Password.");
            error.statusCode = 401;

            throw error;
        }

        if (!process.env.JWT_SECRET_TOKEN) {
            const error = new Error("JWT_SECRET_TOKEN is not configured.");

            throw error;
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
        next(error)
    }
}

async function getCurrentUser(req, res, next) {
    try {
        if (!req.user?.sub) {
            const error = new Error('Please log in.');
            error.statusCode = 401;
            throw error;
        }

        const id = req.user.sub;

        if(!id) {
            const error = new Error("Please Login.");
            error.statusCode = 400;

            throw error;
        };

        const user = await getUser({_id:id});

        if (!user) {
            const error = new Error("User not Found, Please Login or Register");
            error.statusCode = 404;

            throw error;
        };

        return res.status(200).json({
            message: "success",
            user:user
        });
    } catch(error) {
        next(error)
    }
}

async function logoutUser(req, res, next) {
    try {
        const { jti, exp } = req.user;

        if (!jti || !exp) {
            const error = new Error('Invalid access token.');
            error.statusCode = 401;
            throw error;
        }

        await logoutCurrentUser(jti, exp)

        return res.status(200).json({
            success: true,
            message: "Logout successful.",
        });

    } catch (error) {
        next(error)
    }
}

async function refreshUserToken(req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken) {
            const error = new Error("Refresh token missing.");
            error.statusCode = 401;

            throw error;
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN
        );

        const user = await getUser({_id: decoded.sub})

        if (!user) {
            const error = new Error("User not found.");
            error.statusCode = 401;

            throw error;
        }
        const newToken = generateTokens(user);
        return res.status(200).json({
            token: newToken.accessToken
        });      
    } catch (error) {
        next(error);
    }
}

export {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    refreshUserToken
}