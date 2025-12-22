import InventoryItem from "./inventory.model.js";
import Notification from "../notification/notification.model.js";
import { logActivity } from "../../utils/logActivity.js";
import { getPagination } from "../../utils/pagination.js"; 

// Create inventory item
export const createInventoryItem = async (data) => {
  const item = await InventoryItem.create(data);
  return item;
};

// Update inventory item
export const updateInventoryItem = async (id, data) => {
  const updated = await InventoryItem.findByIdAndUpdate(id, data, {
    new: true,
  });
  return updated;
};

// List all inventory items
export const listInventoryItems = () => {
  return InventoryItem.find().sort({ createdAt: -1 });
};

// Get single item
export const getInventoryItem = (id) => {
  return InventoryItem.findById(id);
};

// Deduct stock
export const deductInventoryStock = async (id, amount, user) => {
  const item = await InventoryItem.findById(id);
  if (!item) throw new Error("Item not found");

  if (item.quantity < amount) throw new Error("Insufficient stock");

const before = item.toObject();

  item.quantity -= amount;
  await item.save();

  const after = item.toObject();
  await logActivity({
    user,
    module: "inventory",
    action: "deduct_stock",
    description: `Deducted ${amount} ${item.unit} of ${item.name}`,
    type: "advanced",
    before,
    after,
  });
  // Trigger low-stock notification
  if (item.quantity <= item.threshold) {
    await Notification.create({
      type: "low_stock",
      message: `${item.name} is running low (Remaining: ${item.quantity})`,
      item: item._id,
    });
  }

  return item;
};
