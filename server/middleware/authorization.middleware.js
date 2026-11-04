import { rolePermissions } from "../config/roles.js";

const authorize = (permission) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const allowedPermissions = rolePermissions[user.role] || [];

        if (!allowedPermissions.includes(permission)) {
            return res.status(403).json({
                message: 'You do not have permission to perform this action.',
            });
        }
        next();        
    }
}

export default authorize;