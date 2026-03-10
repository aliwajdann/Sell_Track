import { query } from "../db/db.js";

export const createProduct = async (req, res, next) => {
    const { name, price } = req.body;
    const userId = req.user.id;

    try {
        const result = await query(
            `INSERT INTO products (name, price, user_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [name, price, userId]
        );

        res.status(201).json({
            message: "Product created",
            product: result.rows[0]
        });

    } catch (err) {
        next(err);
    }
};

export const getMyProducts = async (req, res, next) => {
    const userId = req.user.id;

    try {
        const result = await query(
            `SELECT * FROM products WHERE user_id = $1`,
            [userId]
        );

        res.json(result.rows);

    } catch (err) {
        next(err);
    }
};


export const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { name, price } = req.body;
    const userId = req.user.id;

    try {
        const result = await query(
            `UPDATE products
   SET name = $1, price = $2
   WHERE id = $3 AND user_id = $4
   RETURNING *`,
            [name, price, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({
            message: "Product updated",
            product: result.rows[0]
        });

    } catch (err) {
        next(err);
    }
};


export const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;


    try {

        const result = await query(
            `DELETE FROM products
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({
            message: "Product deleted"
        });

    } catch (err) {
        next(err);
    }
};