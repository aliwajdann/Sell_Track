import express from "express";
import { createOrder, updateOrder, deleteOrder, getOrders } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getOrders);
router.put("/:id", verifyToken, updateOrder);
router.delete("/:id", verifyToken, deleteOrder);
export default router;