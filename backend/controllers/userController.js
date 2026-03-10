import { query } from "../db/db.js";

export const getUsers = async (req, res, next) => {
    try {
        const result = await query(
            "SELECT name, username, email FROM users"
        );


        return res.json(result.rows);

    } catch (err) {
        next(err);
    }
};

export const getCurrentUser = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const result = await query(
            `SELECT id, name, email FROM users WHERE id = $1`,
            [userId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};