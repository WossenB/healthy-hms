import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './midleware/errorHandler.js';
import { protect, type AuthRequest } from './midleware/auth.js'; // ✅ import at top

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// routes
app.use('/api/auth', authRoutes);

app.get('/', (_, res) => res.send('Healthy HMS Backend ✅'));

// ✅ Protected test route
app.get('/api/protected', protect, (req: AuthRequest, res) => {
  res.json({ message: 'Access granted ✅', user: req.user });
});

// error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
