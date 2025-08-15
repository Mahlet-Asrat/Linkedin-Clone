import { hash, genSalt, compare } from "bcryptjs"
import jwt from 'jsonwebtoken'
import User from "../models/user.model.js"
import { loginSchema, userInputSchema } from "../dto/auth.schema.js"
import { ZodError } from "zod"
import { sendWelcomeEmail } from "../emails/emailHandlers.js"

export const signup = async(req, res) =>{
    try{
        const body = req.body
        const {name, username, email, password} = userInputSchema.parse(body)
        const existEmail = await User.findOne({email})
        if(existEmail){
            return res.status(400).json({message: "Email already exists"})
        }

        const existUsername = await User.findOne({username})
        if(existUsername){
            return res.status(400).json({message: "Username already exists"})
        }

        const salt  = await genSalt(10)
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
            maxAge: 3 * 24 * 60 * 6 * 1000, // 3 days
            sameSite: 'strict', //prevent CSRF
            secure: process.env.NODE_ENV === 'production' // prevents man-in-the-middle-attacks
        })

        res.status(201).json({message: "User registered successfully"})

        const profileUrl = `${process.env.CLIENT_URL}/profile/${user.username}`

        try{  
            await sendWelcomeEmail(user.email, user.name, profileUrl)
        }catch(emailError){
            console.log(emailError, "Error sending welcome email");
        }

    }catch(error){

        console.error('Signup error:', error);

    if (error instanceof ZodError) {
        return res.status(400).json({
        message: error.errors?.[0]?.message || "Invalid input",
        });
    }

    res.status(500).json({ message: error.message });
}
} 

export const login = async(req, res) =>{

    try{
    const body = req.body
    const {email, password} = loginSchema.parse(body)

    const user = await User.findOne({email})
    if(!user){
        return res.status(401).json({message: 'Invalid email'})
    }
    const validPassword = await compare(password, user.password)
    if(!validPassword){
        return res.status(401).json({message: 'Invalid credentials'})
    }
    
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '3d'})

    await res.cookie('jwt-linkedin', token , {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === 'production'
    })

    res.json({message: 'Logged in Successfully'})
}catch(error){
    res.status(500).json({message: error.message})
}
}   

export const logout = (req, res) =>{
    res.clearCookie("jwt-linkedin")
    res.json({message: 'Logged out successfully'})
}

export const getCurrentUser = async(req, res) =>{
    try {
        const user = req.user
        res.json(user)
    } catch (error) {
        res.status(500).json({message: 'Server Error'})
    }
}

