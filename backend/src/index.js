const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const modpackRoutes = require('./routes/modpack');
const authRoutes = require('./routes/auth');

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: [
    'https://onlive.is-a.dev',
    'https://onlive.is-a.dev/ModForge-AI',
    'https://onlive.is-a.dev/ModForge-AI/',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api', modpackRoutes);

app.options('*', cors());

app.get('/', (req, res) => {
  res.json({ status: 'ModForge AI API is running' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});