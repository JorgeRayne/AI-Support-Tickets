import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default function authToken(req, res, next) {
    const authHeader = req.headers
    const authToken = authHeader?.authorization && authHeader.authorization.split(" ")[1];

    if(!authToken) return res.status(401).json({ message: "Access token is required." });

    try {
        const decode = jwt.verify(
            authToken,
            process.env.JWT_SECRET_TOKEN,
            {
                algorithms: ['HS256']
            }
        );

        req.user = decode;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token."
        });
    }
}