import jwt from 'jsonwebtoken';
import 'dotenv/config';

export default function authToken(req, res, next) {
    const authHeader = req.headers
    const authToken = authHeader.authorization.split(" ")[1];

    if(!authToken) return res.status(401).json();

    jwt.verify(authToken, process.env.JWT_SECRET_TOKE, (err, user) =>{
        if(err) return res.status(403);
        req.user = user;
    });
    next();
}