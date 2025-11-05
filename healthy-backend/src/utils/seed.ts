import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/healthy';

const seed = async () => {
  await mongoose.connect(uri);
  const adminEmail = 'admin@healthy.local';
  const exists = await User.findOne({ email: adminEmail });
  if (!exists) {
    const hashed = await bcrypt.hash('AdminPass123!', 10);
    await User.create({ name: 'Admin', email: adminEmail, password: hashed, role: 'admin' });
    console.log('Admin user created:', adminEmail);
  } else console.log('Admin exists');
  process.exit(0);
};

seed();
