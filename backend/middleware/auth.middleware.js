import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'


export const authMiddleware = async(req, res, next)=>{
    try{
        const token = req.cookies['jwt-linkedin']
        if(!token){
            res.status(401).json({message: 'Unauthorized - No token provided'})
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            res.status(401).json({message: 'Unauthorized - Invalid token'})
        }

        const user = await User.findById(decoded.userId).select('-password') // leave out password
        if(!user){
            res.status(401).json({message: "User not found"})
        }
        req.user = user 
        next()
    }catch(error){
        console.log("Error in authMiddleware", error.message)
        res.status(500).json({message: error.message})
    }
}