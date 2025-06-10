import Notification from "../models/notification.model.js";

export const getUserNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notification = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate("relatedUser", "name username profilePicture")
      .populate("relatedPost", "content image");
    res.status(200).json(notification);
  } catch (error) {
    console.log("Error in getting user notification", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findByIdAndUpdate(
      { _id: notificationId, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    console.log("Error marking notification as read", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;
  try {
    const notification = Notification.findOneAndDelete({
      _id: notificationId,
      recipient: req.user._id,
    });

    if (!notification) {
      res.status(404).json({ message: "Notification not found" });
    }
    res.json(notification);
  } catch (error) {
    console.log("Error deleting notification", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
