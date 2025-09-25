require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
