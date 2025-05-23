import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { getPublicProfile, getSuggestedConnections, updateProfile} from '../controllers/user.controller.js'


export const userRoutes = express.Router()

userRoutes.get('/suggestions', authMiddleware, getSuggestedConnections)
userRoutes.get('/:username', authMiddleware, getPublicProfile)
userRoutes.put('/profile', authMiddleware, updateProfile)