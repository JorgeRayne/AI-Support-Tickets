import jwt from 'jsonwebtoken';
import 'dotenv/config';
import RevokedToken from '../models/revokedToken.model.js'

export default async function authToken(req, res, next) {
    const authHeader = req.headers
    const authToken = authHeader?.authorization && authHeader.authorization.split(" ")[1];

    if(!authToken) {
        const error = "Access token is required.";
        error.statusCode = 401;

        return next(error);
    };

    try {
        const decoded = jwt.verify(
            authToken,
            process.env.JWT_SECRET_TOKEN,
            {
                algorithms: ['HS256']
            }
        );

        if (!decoded.jti) {
            const error = "Invalid token."
            error.statusCode = 401 
            return next(error);
        }

        const revoked = await RevokedToken.findOne({
            jti: decoded.jti,
        });

        if (revoked) {
            const error = "Token has been revoked. Please log in again."
            error.statusCode = 401 
            return next(error);
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (
            error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError' ||
            error.name === 'NotBeforeError'
        ) {
            error.statusCode = 401;
        }

        return next(error);
    }
}