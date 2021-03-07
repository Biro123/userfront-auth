const express = require('express');
require('dotenv').config();
const helmet = require('helmet');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect to database
connectDB();

// define security policy
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", 'https://api.userfront.com', 'https://api.anymod.com/'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", process.env.APP_URL],
      styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
      imgSrc: ["'self'", 'https://*.com'],
      fontSrc: ["'self'", 'https://*.com', 'data:']
    },
  }
};

// Init Middlewre
app.use(helmet(helmetConfig));  
app.use(express.json({ extended: false }));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/data', require('./routes/api/data')); // replace

// Serve static assets in production
if(process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));