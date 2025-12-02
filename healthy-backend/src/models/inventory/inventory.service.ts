import InventoryItem from "./inventory.model.js";
import Notification from "../notification/notification.model.js";

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
export const deductInventoryStock = async (id, amount) => {
  const item = await InventoryItem.findById(id);
  if (!item) throw new Error("Item not found");

  if (item.quantity < amount) throw new Error("Insufficient stock");

  item.quantity -= amount;
  await item.save();

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
