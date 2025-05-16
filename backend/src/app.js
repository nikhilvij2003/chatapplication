const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/users');
const roomRoutes = require('./routes/rooms');
const messageRoutes = require('./routes/messages');
// Assuming errorHandler middleware is in middlewares/error.js
// const { errorHandler } = require('./middlewares/error');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();


// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/messages', messageRoutes);


// app.use(errorHandler);

module.exports = app;
