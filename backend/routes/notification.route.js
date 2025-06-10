import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  deleteNotification,
  getUserNotification,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

export const notificationRoutes = express.Router();

notificationRoutes.get("/", authMiddleware, getUserNotification);
notificationRoutes.put("/:id", authMiddleware, markNotificationAsRead);
notificationRoutes.delete("/:id", authMiddleware, deleteNotification);
