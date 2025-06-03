import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
     
    },
    recipientRole: {
      type: String,
      required: true,
      enum: ['Admin', 'Delivery Partner', 'Inventory Manager', 'Finance Manager'],
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String, // Optional link for notification redirect
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
