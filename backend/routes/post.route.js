import express from "express";
import {
  getFeedPosts,
  createPosts,
  deletePost,
  getPostById,
  commentOnPost,
  likePost,
} from "../controllers/post.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const postRoutes = express.Router();

postRoutes.get("/", authMiddleware, getFeedPosts);
postRoutes.get("/:id", authMiddleware, getPostById);
postRoutes.post("/create", authMiddleware, createPosts);
postRoutes.delete("/delete/:id", authMiddleware, deletePost);
postRoutes.post("/:id/comment", authMiddleware, commentOnPost);
postRoutes.post("/:id/like", authMiddleware, likePost);
