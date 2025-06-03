import { Router } from "express";
import { getNotificationsByRecipient,updatenotification ,clearnotification} from "../controllers/notification.controller.js";
import auth from "../middleware/auth.js";


const notification = Router()
notification.get("/getnotifications",auth, getNotificationsByRecipient)
notification.put("/updatenotification",auth, updatenotification);
notification.delete("/clearnotification",auth, clearnotification);
export default notification