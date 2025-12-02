import {
    createNotification,
    markNotificationRead,
    listNotifications,
    listUnreadNotifications,
    deleteNotification,
  } from "./notification.service.js";
  
  // Manual creation (for admin/system use)
  export const createNotificationController = async (req, res) => {
    const { type, message, item } = req.body;
  
    const note = await createNotification({
      type,
      message,
      item,
      user: req.user._id,
    });
  
    res.json({ message: "Notification created", notification: note });
  };
  
  // List all
  export const listNotificationsController = async (_, res) => {
    const notes = await listNotifications();
    res.json(notes);
  };
  
  // Unread list
  export const listUnreadNotificationsController = async (_, res) => {
    const notes = await listUnreadNotifications();
    res.json(notes);
  };
  
  // Mark read
  export const markReadController = async (req, res) => {
    const note = await markNotificationRead(req.params.id);
    res.json({ message: "Notification marked as read", notification: note });
  };
  
  // Delete
  export const deleteNotificationController = async (req, res) => {
    await deleteNotification(req.params.id);
    res.json({ message: "Notification deleted" });
  };