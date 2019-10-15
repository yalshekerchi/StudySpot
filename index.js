const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const bodyParser = require('body-parser');
const path = require('path');

const keys = require('./config/keys');

// Connect to MongoDB
require('./models/Building');
require('./models/Room');
require('./models/Section');
require('./models/ClassSlot');

mongoose.connect(keys.mongoURI);

// Initialize Passport Authentication
passport.use(
  new BasicStrategy((username, password, cb) => {
    if (username === keys.authUsername && password === keys.authPassword) {
      return cb(null, true);
    }
    return cb(null, false);
  })
);

// Create Express server
const app = express();

// Define Middleware
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Import routes
require('./routes/authenticatedRoutes')(app);
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
