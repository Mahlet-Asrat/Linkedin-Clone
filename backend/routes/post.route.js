import express from 'express'
import { getFeedPosts, createPosts, deletePost } from '../controllers/post.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

export const postRoutes = express.Router()

postRoutes.get('/', authMiddleware, getFeedPosts)
postRoutes.post('/create', authMiddleware, createPosts)
postRoutes.delete('/delete/:id', authMiddleware, deletePost )