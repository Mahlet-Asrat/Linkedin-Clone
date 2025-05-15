import { hash } from "bcryptjs"
import jwt from 'jsonwebtoken'
import User from "../models/user.model.js"

export const signup = async(req, res) =>{
    try{
        const {name, username, email, password} = req.body
        const existEmail = await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message: "Email already exists"})
        }

        const existUsername = await User.findOne({username})
        if(existUsername){
            return res.status(400).json({message: "Username already exists"})
        }
        
        if (password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"})
        }  

        const salt  = await bcrypt.genSalt(10)
        const hashedPassword = await hash(password, salt)

        const user = new User({
            name,
            password: hashedPassword,
            email,
            username
        })
        await user.save()

        const token = jwt.sign({ userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: '3d'
        })

        res.cookie("jwt-linkedin", token,{
            httpOnly: true, // prevent xxs (cross site attack) attack like ppl can't access this cookie with js
            maxAge: 3 * 24 * 60 * 6 * 1000,
            sameSite: 'strict' //prevent CSRF
        })

    }catch(error){

    }
}

export const login = (req, res) =>{
    res.send('login')
}

export const logout = (req, res) =>{
    res.send('logout')
}