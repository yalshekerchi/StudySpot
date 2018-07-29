const express = require('express');

const app = express();

// Default route handler
app.get('/', (req, res) => {
  res.send({ message: 'Hello World' });
});

// Listen to port 5000
const PORT = process.env.PORT || 5000;
app.listen(5000);
