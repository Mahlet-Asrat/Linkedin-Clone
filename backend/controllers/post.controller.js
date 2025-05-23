import cloudinary from "../lib/cloudinary.js"
import Post from "../models/post.model.js"


export const getFeedPosts = async(req, res)=>{
    try {
        const connections = req.user.connections
        const posts = await Post.find({author: {$in: connections}})
        .populate('author', 'name username profilePicture headline')
        .populate('comments.user', 'name profilePicture')
        .sort({createdAt: -1}) // see the latest posts 

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in getFeedPost controller:", error)
        res.status(500).json({message: error.message}) 
    } 
}


export const createPosts = async(req, res) =>{

    try {
        const {content, image} = req.body

        let newPost;

        if(image){
            const result = await cloudinary.uploader.upload(image)
            newPost = new Post({
                author: req.user._id,
                content,
                image: result.secure_url
            })
        } else{
            newPost = new Post({
                author: req.user._id,
                content,
            })
        }

        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        console.log("Error while creating a post:", error)
        res.status(500).json({message: error.message})
    }
}


export const deletePost = async(req, res) =>{
    
}