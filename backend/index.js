import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: "https://sell-track.vercel.app",
    credentials: true
}));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.get("/", (req, res) => {
    res.send("SellTrack API is alive 🚀");
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// 2. The 404 Handler (If we get here, no route matched)
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // This sends the 404 error to the actual error middleware below
});

// 3. The Global Error Middleware (Handles both 400s, 404s, and 500s)
app.use(errorHandler);
// app.use(errorHandler);
// {
//     "name": "Ali Wajdan",
//     "username" : "aliwajdan",
//     "email" : "aliwajdan.it@gmail.com",
//     "password": "yoyo123&"
// }
// {
//     "email" : "aliwajdan.it@gmail.com",
//     "password": "yoyo123&"
// newStrongPassword456
// }