require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/scores');
const path = require('path');

const app = express(); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});
