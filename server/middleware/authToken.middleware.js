import jwt from 'jsonwebtoken';
import 'dotenv/config';
import RevokedToken from '../models/revokedToken.model.js'

export default async function authToken(req, res, next) {
    const authHeader = req.headers
    const authToken = authHeader?.authorization && authHeader.authorization.split(" ")[1];

    if(!authToken) return res.status(401).json({ message: "Access token is required." });

    try {
        const decoded = jwt.verify(
            authToken,
            process.env.JWT_SECRET_TOKEN,
            {
                algorithms: ['HS256']
            }
        );

        if (!decoded.jti) {
            return res.status(401).json({
                message: "Invalid token.",
            });
        }

        const revoked = await RevokedToken.findOne({
            jti: decoded.jti,
        });

        if (revoked) {
            return res.status(401).json({
                message: "Token has been revoked. Please log in again.",
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Invalid or expired access token.",
            });
        }

        console.error("Authentication error:", error);

        return res.status(500).json({
            message: "Authentication failed.",
        });
    }
}