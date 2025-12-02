import Notification from "./notification.model.js";

// Create a new notification
export const createNotification = async ({ type, message, item, user }) => {
  return Notification.create({
    type,
    message,
    item,
    createdBy: user,
  });
};

// Mark notification as read
export const markNotificationRead = async (id) => {
  return Notification.findByIdAndUpdate(id, { read: true }, { new: true });
};

// List notifications (latest first)
export const listNotifications = async () => {
  return Notification.find().sort({ createdAt: -1 });
};

// List unread notifications
export const listUnreadNotifications = async () => {
  return Notification.find({ read: false }).sort({ createdAt: -1 });
};

// Delete notification
export const deleteNotification = async (id) => {
  return Notification.findByIdAndDelete(id);
};