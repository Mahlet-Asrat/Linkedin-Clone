import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  acceptConnectionRequest,
  getConnectionRequests,
  getConnectionStatus,
  getUserConnections,
  rejectConnectionRequest,
  removeConnection,
  sendConnectionRequest,
} from "../controllers/connection.controller.js";

const connectionRoutes = express.Router();

connectionRoutes.post(
  "/request/:userId",
  authMiddleware,
  sendConnectionRequest
);
connectionRoutes.put(
  "/accept/:requestId",
  authMiddleware,
  acceptConnectionRequest
);
connectionRoutes.put(
  "/reject/:requestId",
  authMiddleware,
  rejectConnectionRequest
);

connectionRoutes.get("/requests", authMiddleware, getConnectionRequests);

connectionRoutes.get("/", authMiddleware, getUserConnections);
connectionRoutes.delete("/:userId", authMiddleware, removeConnection);
connectionRoutes.get("/status/:userId", authMiddleware, getConnectionStatus);

export default connectionRoutes;
