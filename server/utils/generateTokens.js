import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config';

export const generateTokens = (user) => {

    const accessToken = jwt.sign(
        {
            sub: user._id,
            jti: crypto.randomUUID(),
            role: user.role,
            type: 'access'
        },
        process.env.JWT_SECRET_TOKEN,
        {
            expiresIn: '15m',
            algorithm: 'HS256'
        }
    );

    const refreshToken = jwt.sign(
        {
            sub: user._id,
            jti: crypto.randomUUID(),
            type: 'refresh'
        },
        process.env.JWT_REFRESH_TOKEN,
        {
            expiresIn: '7d',
            algorithm: 'HS256'
        }
    );

    const refreshTokenHash = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    return {
        accessToken,
        refreshToken,
        refreshTokenHash
    };
};