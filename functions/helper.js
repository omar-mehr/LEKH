import { verifyToken } from "./functionHash.js";
export function getAuthenticatedUser(req) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return {
            status: 401,
            error: "Authorization token required"
        };
    }

    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);

    if (!user) {
        return {
            status: 401,
            error: "Invalid or expired token"
        };
    }

    return {
        user: user
    };
}

export function checkRole(user, roles) {
    if (!roles.includes(user.role)) {
        return {
            status: 403,
            error: "Access denied"
        };
    }

    return null;
}
