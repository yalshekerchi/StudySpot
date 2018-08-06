const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

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
require('./routes/scrapeRoutes')(app);
require('./routes/apiRoutes')(app);


if (process.env.NODE_ENV === 'production') {
  // Serve producution assets, ie. main.js, main.css
  app.use(express.static('client/build'));

  // If unknown route, serve index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Listen to appropriate port based on environment
const PORT = process.env.PORT || 5000;
app.listen(PORT);
