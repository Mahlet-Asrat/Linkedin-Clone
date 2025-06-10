import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

export const getFeedPosts = async (req, res) => {
  try {
    const connections = req.user.connections;
    const posts = await Post.find({ author: { $in: connections } })
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 }); // see the latest posts

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getFeedPost controller:", error);
    res.status(500).json({ message: error.message });
  }
};

export const createPosts = async (req, res) => {
  try {
    const { content, image } = req.body;

    let newPost;

    if (image) {
      const result = await cloudinary.uploader.upload(image);
      newPost = new Post({
        author: req.user._id,
        content,
        image: result.secure_url,
      });
    } else {
      newPost = new Post({
        author: req.user._id,
        content,
      });
    }

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error while creating a post:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.param.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json("Post not found");
    }

    // Check is the current user is the owner of the post
    if (post.author.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You aren't authorized to delete this post" });
    }

    // to delete the image from cloudinary as well
    if (post.image) {
      // from the image url format of a cloudinary, we extract the image id

      const imageId = post.image.split("/".pop().split(".")[0]);
      await cloudinary.uploader.destroy(imageId);
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error deleting post", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.param.id;

    const post = await Post.findById(postId)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline");

    if (!post) {
      res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.log("Error getting post by id", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment } = req.body;
    const userId = req.user._id;

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: userId, content: comment } },
      },
      { new: true }
    ).populate("author", "name email username headline profilePicture");

    // create a notification for comments made by users other than the one who made the post

    if (post.author.toString() !== userId.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: "comment",
        relatedPost: postId,
        relatedUser: userId,
      });

      await newNotification.save();
      // send email notification
      try {
        const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
        await sendCommentNotificationEmail(
          post.author.email,
          post.author.name,
          req.user.name,
          postUrl,
          comment
        );
      } catch (error) {
        console.error("Error in sending comment notification email", error);
      }
    }
    res.status(201).json(post);
  } catch (error) {
    console.error("Error posting a comment", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likePost = async(req, res) =>{

  try {

    const postId = req.params.id
    const post = Post.findById(postId)
    const userId = req.user._id

    if(post.likes.includes(userId)){
      // unlike the post
      post.likes = post.likes.filter(id => id.toString() !== userId.toString())
    }
    post.likes.push(userId)

    // create notification

    if(post.author.toString() !== userId.toString()){
      const newNotification = new Notification({
        recipient: post.author,
        type: "like",
        relatedPost: postId,
        relatedUser: userId,
      });
    }
    await newNotification.save()
  } catch (error) {
    console.error("Error liking a post", error);

  }

}