import { query } from "../db/db.js";

export const createOrder = async (req, res, next) => {
    const userId = req.user.id;
    const { customer_name, customer_phone, customer_email, customer_address, items } = req.body;

    try {
        // 1. Create the main Order
        const orderResult = await query(
            `INSERT INTO orders (user_id, customer_name, customer_phone, customer_email, address)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [userId, customer_name, customer_phone, customer_email, customer_address]
        );
        const order = orderResult.rows[0];

        // 2. Loop through items and get prices from DB
        for (const item of items) {
            const productRes = await query(`SELECT price FROM products WHERE id = $1`, [item.product_id]);
            const price = productRes.rows[0].price;

            await query(
                `INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
                 VALUES ($1, $2, $3, $4)`,
                [order.id, item.product_id, item.quantity, price]
            );
        }

        res.status(201).json({ message: "Order created", order });
    } catch (err) {
        next(err);
    }
};

export const updateOrder = async (req, res, next) => {
    const { id } = req.params; // Order ID
    const userId = req.user.id;
    const {
        customer_name,
        customer_phone,
        customer_email,
        customer_address,
        status,
        items // The array of products from the frontend
    } = req.body;

    try {
        // 1. Update the main order info
        const result = await query(
            `UPDATE orders
             SET customer_name = $1, customer_phone = $2, customer_email = $3, address = $4, status = $5
             WHERE id = $6 AND user_id = $7
             RETURNING *`,
            [customer_name, customer_phone, customer_email, customer_address, status, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        // 2. Clear out the old items for this order
        await query(`DELETE FROM order_items WHERE order_id = $1`, [id]);

        // 3. Re-insert the updated items list
        // Note: We fetch the price from the products table to ensure data integrity
        for (const item of items) {
            const productRes = await query(`SELECT price FROM products WHERE id = $1`, [item.product_id]);

            if (productRes.rows.length > 0) {
                const price = productRes.rows[0].price;
                await query(
                    `INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
                     VALUES ($1, $2, $3, $4)`,
                    [id, item.product_id, item.quantity, price]
                );
            }
        }

        res.json({
            message: "Order and items updated successfully",
            order: result.rows[0]
        });

    } catch (err) {
        next(err);
    }
};

export const deleteOrder = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {

        const result = await query(
            `DELETE FROM orders
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Order not found or not yours"
            });
        }

        res.json({
            message: "Order deleted"
        });

    } catch (err) {
        next(err);
    }
};




export const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await query(
            `
      SELECT
        o.id AS order_id,
        o.customer_name,
        o.customer_email,
        o.customer_phone,
        o.address,
        o.status,
        o.created_at,

        oi.id AS item_id,
        oi.quantity,
        oi.price_at_time,

        p.id AS product_id,
        p.name AS product_name

      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id

      WHERE o.user_id = $1

      ORDER BY o.created_at DESC
      `,
            [userId]
        );

        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};