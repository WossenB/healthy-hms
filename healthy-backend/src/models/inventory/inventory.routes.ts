import express from "express";
import { protect } from "../../midleware/auth.js";

import {
  addInventoryController,
  updateInventoryController,
  listInventoryController,
  getInventoryController,
  deductStockController,
} from "./inventory.controller.js";

const router = express.Router();

// Add new inventory item
router.post("/", protect, addInventoryController);

// List all items
router.get("/", protect, listInventoryController);

// Get single item
router.get("/:id", protect, getInventoryController);

// Update item
router.put("/:id", protect, updateInventoryController);

// Deduct stock
router.put("/deduct/:id", protect, deductStockController);

export default router;
