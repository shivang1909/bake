import mongoose from 'mongoose';
import Notification from "../models/Notification.model.js"; // Make sure .js is included if using ES modules

const sendnotification = async (id, role, message, link) => {
  console.log("notification function called", id, role, message, link);
  try {
    // Convert id to a valid ObjectId
    
    // Create a new Notification instance
    const notification = new Notification({
      recipientId: id,
      recipientRole: role,
      message,
      link,
    });

    // Save the notification to the database
    await notification.save();
    console.log("Notification saved successfully:", notification);
  } catch (error) {
    console.error("Error saving notification:", error.message);
  }
};

export default sendnotification;
