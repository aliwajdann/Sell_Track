import { query } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const isProductionRequest = (req) => process.env.NODE_ENV === "production" || req.hostname !== "localhost";

const getCookieOptions = (req) => ({
    httpOnly: true,
    secure: isProductionRequest(req),
    sameSite: isProductionRequest(req) ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000
});

const getClearCookieOptions = (req) => ({
    httpOnly: true,
    secure: isProductionRequest(req),
    sameSite: isProductionRequest(req) ? "none" : "lax"
});

const signToken = (user) =>
    jwt.sign(
        {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

const mapDatabaseError = (err) => {
    if (err?.code === "23505") {
        const duplicateField = err?.constraint?.includes("email")
            ? "Email"
            : err?.constraint?.includes("username")
                ? "Username"
                : "Value";

        const error = new Error(`${duplicateField} already exists`);
        error.statusCode = 409;
        return error;
    }

    if (err?.code === "42P01") {
        const error = new Error("Database schema is missing. Create the required tables in Supabase.");
        error.statusCode = 500;
        return error;
    }

    return err;
};

export const registerUser = async (req, res, next) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        const error = new Error("All fields are required");
        error.statusCode = 400;
        return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await query(
            "INSERT INTO users (name, username, email, password) VALUES ($1,$2,$3,$4) RETURNING id,name,username,email",
            [name, username, email, hashedPassword]
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        next(mapDatabaseError(err));
    }
};

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        return next(error);
    }

    try {
        const result = await query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) {
            const error = new Error("Invalid email or password");
            error.statusCode = 400;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            const error = new Error("Invalid email or password");
            error.statusCode = 400;
            throw error;
        }

        const token = signToken(user);
        res.cookie("token", token, getCookieOptions(req));

        return res.status(200).json({
            message: "Login successful!",
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        next(mapDatabaseError(err));
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie("token", getClearCookieOptions(req));
    res.json({ message: "Logged out successfully" });
};

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await query("DELETE FROM users WHERE id = $1", [userId]);
        res.clearCookie("token", getClearCookieOptions(req));

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        next(mapDatabaseError(err));
    }
};

export const updateUser = async (req, res, next) => {
    const userId = req.user.id;
    const { name, email } = req.body;

    try {
        const result = await query(
            `
      UPDATE users
      SET
        name = COALESCE($1, name),
        email = COALESCE($2, email)
      WHERE id = $3
      RETURNING id, name, email, username
      `,
            [name, email, userId]
        );

        const updatedUser = result.rows[0];
        const token = signToken(updatedUser);

        res.cookie("token", token, getCookieOptions(req));

        res.json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (err) {
        next(mapDatabaseError(err));
    }
};

export const updatePassword = async (req, res, next) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    try {
        const userResult = await query(
            `SELECT password FROM users WHERE id = $1`,
            [userId]
        );

        const user = userResult.rows[0];

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            const error = new Error("Current password is incorrect");
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await query(
            `UPDATE users
       SET password = $1
       WHERE id = $2`,
            [hashedPassword, userId]
        );

        res.json({
            message: "Password updated successfully"
        });
    } catch (err) {
        next(mapDatabaseError(err));
    }
};