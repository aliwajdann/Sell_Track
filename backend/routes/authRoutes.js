import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/authController.js";
import { deleteUser, updateUser, updatePassword } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.delete("/deleteaccount", verifyToken, deleteUser);
router.put("/updateprofile", verifyToken, updateUser);
router.put("/password", verifyToken, updatePassword);
router.get("/me", verifyToken, (req, res) => {
    res.json({
        user: req.user
    });
});

export default router;