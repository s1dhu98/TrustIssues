import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/auth.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
const dbURI = process.env.MONGO_URI as string;

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.send('TrustIssues API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
