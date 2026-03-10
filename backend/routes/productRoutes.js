import express from "express";
import { createProduct, getMyProducts, updateProduct, deleteProduct } from "../controllers/productController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createProduct);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);
router.get("/", verifyToken, getMyProducts);

export default router;