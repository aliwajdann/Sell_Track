// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");
        // Attach user info to the request object
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
};