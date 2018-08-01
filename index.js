const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const keys = require('./config/keys');

// Connect to MongoDB
require('./models/Building');
require('./models/Room');
require('./models/Section');
require('./models/ClassDetail');

mongoose.connect(keys.mongoURI);

// Create express server
const app = express();

// Define Middleware
app.use(bodyParser.json());

// Import routes
require('./routes')(app);
require('./routes/scrapeRoutes')(app);

// Listen to port 5000
const PORT = process.env.PORT || 5000;
app.listen(5000);
