const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const modpackRoutes = require('./routes/modpack');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', modpackRoutes);

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
  console.log(`http://localhost:${PORT}`);
});