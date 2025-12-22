import express from "express";
import { protect, authorize } from "../../midleware/auth.js";
import {
  addMessageController,
  getMessagesController,
} from "./message.controller.js";

const router = express.Router();

// Doctor, lab, pharmacy can communicate
router.post(
  "/",
  protect,
  authorize("admin", "doctor", "lab", "pharmacy"),
  addMessageController
);

router.get(
  "/:module/:moduleId",
  protect,
  authorize("admin", "doctor", "lab", "pharmacy"),
  getMessagesController
);

export default router;
