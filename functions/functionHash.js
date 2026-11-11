import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function CreateHash(password) {
    const passwordHash = await bcrypt.hash(password, 10);

    return passwordHash;
}

export async function authenticateUser(user, password) {
    const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        return null;
    }

    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h"
        }
    );

    return {
        token: token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}


export function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}
