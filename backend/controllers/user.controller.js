import { updateProfileSchema } from "../dto/user.schema.js"
import cloudinary from "../lib/cloudinary.js"
import User from "../models/user.model.js"

export const getSuggestedConnections = async(req, res) =>{

}

export const getPublicProfile = async(req, res) =>{

    try {
        const username = req.params.username
        const user = await User.findOne({username}).select('-password')

        if(!user){
            res.status(404).json({message: 'User not found'})
        }
        res.json(user)
    } catch (error) {
        console.log("Error getting public profile", error)
        res.status(500).json({message: 'Server error'})     
    }
}

export const updateProfile = async (req, res) =>{
    try {
        // const allowedFields = ['name', 'headline', 'about', 'location', 'profilePicture', 'bannerImg', 'skills', 'experience', 'education']

        const updatedData = req.body
        const payload = updateProfileSchema.parse(updatedData)
        // for(const field of allowedFields){
        //     if(req.body[field]){
        //         updatedData[field] = req.body[field]
        //     }
        // }
        if(payload.profilePicture){
            const result = await cloudinary.uploader.upload(payload.profilePicture)
            payload[profilePicture] = result.secure_url
        }

        if(payload.bannerImg){
            const result = await cloudinary.uploader.upload(payload.bannerImg)
            payload[bannerImg] = result.secure_url
        }
        const id = req.user._id
        const user = await User.findByIdAndUpdate(id, {$set: payload}, {new: true}).select('-password')
        res.json(user)
    } catch (error) {
        console.log("Error in updating profile", error)
        res.status(500).json({message: 'Server error'})  
    }
}