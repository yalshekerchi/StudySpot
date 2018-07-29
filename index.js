const express = require('express');
const mongoose = require('mongoose');

const keys = require('./config/keys');

// Create express server
const app = express();

// Connect to MongoDB
mongoose.connect(keys.mongoURI);

// Import routes
const routes = require('./routes')(app);

// Listen to port 5000
const PORT = process.env.PORT || 5000;
app.listen(5000);
