import { query } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
    const { name, username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await query(
            "INSERT INTO users (name, username, email, password) VALUES ($1,$2,$3,$4) RETURNING id,name,username,email",
            [name, username, email, hashedPassword]
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const result = await query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

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

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET || "default_secret_key",
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

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
        next(err);
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
}

// controllers/userController.js
export const deleteUser = async (req, res, next) => {
    try {
        // req.user was populated by the 'protect' middleware
        const userId = req.user.id;

        await query("DELETE FROM users WHERE id = $1", [userId]);

        // Clear the cookie so they are logged out
        res.clearCookie("token");

        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        next(err);
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

        // Re-issue token with updated info
        const token = jwt.sign(
            {
                id: updatedUser.id,
                name: updatedUser.name,
                username: updatedUser.username,
                email: updatedUser.email
            },
            process.env.JWT_SECRET || "default_secret_key",
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (err) {
        next(err);
    }
};

export const updatePassword = async (req, res, next) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    try {

        // 1️⃣ Get user from DB
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

        // 2️⃣ Check current password
        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            const error = new Error("Current password is incorrect");
            error.statusCode = 400;
            throw error;
        }

        // 3️⃣ Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4️⃣ Update password
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
        next(err);
    }
};
