import express from "express";
import { protect } from "../../midleware/auth.js";
import {
  createCompany,
  getCompanies,
  updateCompany,
  disableCompany
} from "./company.controller.js";

const router = express.Router();

router.post("/", protect, createCompany);
router.get("/", protect, getCompanies);
router.put("/:id", protect, updateCompany);
router.delete("/:id", protect, disableCompany);

export default router;
