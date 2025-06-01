import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // ✅ Add this
import bookRoutes from './routes/books.js';

dotenv.config();

import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('MongoDB connected successfully!'));


const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // ✅ Allow frontend origin
  credentials: true
}));

app.use(express.json());
app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
