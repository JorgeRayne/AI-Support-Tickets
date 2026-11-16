import { rolePermissions } from "../config/roles.js";

const authorize = (permission) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            const error = new Error('Unauthenticated, Please Login or Signup.');
            error.statusCode = 401;

            return next(error);
        }

        const allowedPermissions = rolePermissions[user.role] || [];

        if (!allowedPermissions.includes(permission)) {
            const error = new Error('Unauthorized, You do not have permission to perform this action.');
            error.statusCode = 401;

            return next(error);
        }
        return next();        
    }
}

export default authorize;