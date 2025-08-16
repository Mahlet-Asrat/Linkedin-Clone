import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { userRoutes } from "./routes/user.route.js";
import { postRoutes } from "./routes/post.route.js";
import { notificationRoutes } from "./routes/notification.route.js";
import connectionRoutes from "./routes/connection.route.js";
import cors from "cors";
import passport from "passport";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration for all environments
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? false // No CORS needed when serving from same origin
        : "http://localhost:5173",
    credentials: true,
  })
);

// if we don't add the limit we get the "Payload too large for JSON" error for the images
app.use(express.json({ limit: "5mb" })); // To parse Json req bodies
app.use(cookieParser()); // get cookies from req

// Initialize passport (no session needed)
app.use(passport.initialize());

// API routes - these must come BEFORE the static file serving
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);

// Serve static files from frontend dist folder
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// Catch-all route for SPA - this should come LAST and only handle non-API routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "frontend", "dist", "index.html"));
});

app.listen(PORT, async () => {
  console.log(`Server Listening on Port ${PORT}....`);
  await connectDB();
});
