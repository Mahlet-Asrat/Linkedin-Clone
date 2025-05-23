import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import connectDB from './lib/db.js'
import cookieParser from 'cookie-parser'
import { userRoutes } from './routes/user.route.js'
import { postRoutes } from './routes/post.route.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json()) // To parse Json req bodies
app.use(cookieParser()) // get cookies from req

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/posts', postRoutes)


app.get('/', (_, res)=>{
    res.status(200).json({message: "Welcome to Linkedin app"})
})

app.listen(PORT, async() =>{
    await connectDB()
    console.log(`Server Listening on Port ${PORT}....`)
})