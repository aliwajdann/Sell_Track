import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { testConnection } from "./db/db.js";

const app = express();
const port = process.env.PORT || 3000;

const requiredEnv = ["DATABASE_URL", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
    console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
    process.exit(1);
}

const normalizeOrigin = (value) =>
    typeof value === "string" ? value.trim().replace(/\/+$/, "") : value;

const allowedOrigins = new Set(
    [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://sell-track.vercel.app",
        process.env.FRONTEND_URL
    ]
        .filter(Boolean)
        .map(normalizeOrigin)
);

const isAllowedVercelPreview = (origin) =>
    typeof origin === "string" && /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin);

app.use(express.json());
app.use(
    cors({
        origin: (origin, callback) => {
            const normalizedOrigin = normalizeOrigin(origin);

            if (!origin || allowedOrigins.has(normalizedOrigin) || isAllowedVercelPreview(normalizedOrigin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.send("SellTrack API is alive");
});

app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

app.use(errorHandler);

const startServer = async () => {
    try {
        await testConnection();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1);
    }
};

startServer();
