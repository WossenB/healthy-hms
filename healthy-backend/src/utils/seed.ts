// src/utils/seed.ts (append or update)
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/User"; // adjust path if necessary

dotenv.config();

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/healthy";

const createTestUsers = async () => {
  await mongoose.connect(uri);

  const users = [
    { name: "Admin", email: "admin@healthy.local", password: "AdminPass123!", role: "admin" },
    { name: "Reception", email: "reception@healthy.local", password: "Reception1!", role: "reception" },
    { name: "Dr John", email: "doc@healthy.local", password: "Doctor1!", role: "doctor" },
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ name: u.name, email: u.email, password: hashed, role: u.role });
      console.log("Created user:", u.email, u.role);
    } else {
      console.log("User exists:", u.email);
    }
  }
  process.exit(0);
};

createTestUsers().catch((err) => { console.error(err); process.exit(1); });
