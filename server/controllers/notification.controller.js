import Notification from "../models/Notification.model.js";
import mongoose from "mongoose";

const clearnotification = async (req, res) => {
    const recipientId = req.userId; // Assume logged-in user's ID is stored in req.user.id
    try {
        console.log("Deleting notifications for recipient:", recipientId); // Debugging line
        const deletedNotifications = await Notification.deleteMany({
            recipientId,
            isRead: true,
        });
        console.log("Deleted notifications count:", deletedNotifications.deletedCount); // Debugging line
        res.status(200).json({ message: "Notifications cleared successfully" }); 

    } catch (error) {
        console.log('this is error',error); // Debugging line
        res.status(500).json({ message: 'Failed to clear notifications', error });
    }
}



const updatenotification = async (req, res) => {
  try {
    
    const recipientId  = req.userId; 
    const updatedNotifications = await Notification.updateMany(
      { recipientId, isRead: false },
      { $set: { isRead: true } }
  );
    res.status(200).json({ message: "Notification updated successfully" });
  } catch (error) {
     console.log('this is error',error); // Debugging line
  }
}
const getNotificationsByRecipient = async (req, res) => {

    
    try {
        console.log("Fetching notifications for recipient:", req.userId); // Debugging line
        const recipientId = req.userId; // Assume logged-in user's ID is stored in req.user.id
        const recipientRole = req.role; // Assume logged-in user's role is stored in req.user.role
      const notifications = await Notification.find({
        recipientId,
       
      }).sort({ createdAt: -1 });
      const newnotificationsid = await Notification.find(
        { recipientId, isRead: false }
      )
        .select('_id') // Only return the _id field
        .sort({ createdAt: -1 });
      const count = newnotificationsid.length; // Get the count of notifications
      console.log("New notifications count:", notifications); // Debugging line
      res.status(200).json({ count, notifications });
    } catch (error) {
        console.log('this is error',error); // Debugging line
      res.status(500).json({ message: 'Failed to fetch notifications', error });
    }
  };


 

  export { getNotificationsByRecipient,updatenotification,clearnotification };   