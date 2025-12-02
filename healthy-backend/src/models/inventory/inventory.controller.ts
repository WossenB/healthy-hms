import {
    createInventoryItem,
    updateInventoryItem,
    listInventoryItems,
    getInventoryItem,
    deductInventoryStock,
  } from "./inventory.service.js";
  
  export const addInventoryController = async (req, res) => {
    const { name, category, quantity, unit, threshold, expiryDate } = req.body;
  
    const item = await createInventoryItem({
      name,
      category,
      quantity,
      unit,
      threshold,
      expiryDate,
      createdBy: req.user.id,
    });
  
    res.json({ message: "Inventory item added", item });
  };
  
  export const updateInventoryController = async (req, res) => {
    const item = await updateInventoryItem(req.params.id, {
      ...req.body,
      updatedBy: req.user._id,
    });
  
    res.json({ message: "Inventory updated", item });
  };
  
  export const listInventoryController = async (_, res) => {
    const items = await listInventoryItems();
    res.json(items);
  };
  
  export const getInventoryController = async (req, res) => {
    const item = await getInventoryItem(req.params.id);
    res.json(item);
  };
  
  export const deductStockController = async (req, res) => {
    const { amount } = req.body;
  
    const item = await deductInventoryStock(req.params.id, amount);
  
    res.json({ message: "Stock updated", item });
  };
  