import Notification from "./notification.model.js";
import { getPagination } from "../../utils/pagination.js";

// Create a new notification
export const createNotification = async ({ type, message, item, user }) => {
  return Notification.create({
    type,
    message,
    item,
    createdBy: user,
  });
};

export const getAllNotifications = async (query) => {
  const { search = "" } = query;
  const { page, limit, skip } = getPagination(query);

  const filter = {
    isActive: true,
    $or: [
      { type: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ],
  };

  const notifications = await Notification.find(filter)
    .populate("createdBy", "name email role")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  const total = await Notification.countDocuments(filter);

  return {
    data: notifications,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};
// Mark notification as read
export const markNotificationRead = async (id) => {
  return Notification.findByIdAndUpdate(id, { read: true }, { new: true });
};

// List notifications (latest first)
export const listNotifications = async () => {
  return Notification.find().sort({ createdAt: -1 }).lean();
};

// List unread notifications
export const listUnreadNotifications = async () => {
  return Notification.find({ read: false }).sort({ createdAt: -1 }).lean();
};

// Delete notification
export const deleteNotification = async (id) => {
  return Notification.findByIdAndDelete(id);
};