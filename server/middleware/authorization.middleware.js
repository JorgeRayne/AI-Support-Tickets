import { roles } from "../config/roles";

export const  authorize = (permission) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const allowedPermissions = roles[user.role] || [];

        if (!allowedPermissions.includes(permission)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action.',
            });
        }
        next();        
    }
}