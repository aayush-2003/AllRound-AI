const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config(); // Load environment variables

mongoose.connect('mongodb://localhost:27017/ai', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

// Session middleware for authentication
app.use(session({
    secret: 'heaanufebuw3rq37rh327rq__(&$^Tknfef37grfgeyfevwe6fwe6few6ewfefwe68td2q8e4wwr37qhfuesfiufvidfsfgusyfw67rf)*($&*T%&*GYRVREV', //process.env.session_key
    resave: false,
    saveUninitialized: true,
}));

// Middleware to check authentication status
const requireAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        return next();
    } else {
        return res.redirect('/api/login'); // Adjust redirect path if needed
    }
};

// Protect the entire 'ai' directory
app.use('/ai', requireAuth);

// Route for serving the protected index.html file
app.get('/ai/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'ai', 'index.html'));
});

// Serve static files from the 'static' directory
app.use('/', express.static(path.join(__dirname, 'static')));

// Login route (unchanged)
app.post('/api/login', async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;
      const user = await User.findOne({ email }).lean();
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        // Invalid username or password
        return res.status(401).json({ status: 'error', error: 'Invalid Username or Password' });
      }
  
      // Set HttpOnly cookie
      const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60000; // 30 days or 1 hour
      res.cookie('userId', user._id, { httpOnly: true, maxAge });
  
      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
  });
  

// Register route (unchanged)
app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, phone_number, password: plainTextPassword } = req.body;
  
    if (!firstName || typeof firstName !== 'string') {
      return res.json({ status: 'error', error: 'Invalid Parameter' });
    }
    if (!lastName || typeof lastName !== 'string') {
      return res.json({ status: 'error', error: 'Invalid Parameter' });
    }
    if (!plainTextPassword || plainTextPassword.length < 6) {
      return res.json({ status: 'error', error: 'Password should be greater than 6 Characters' });
    }
  
    const password = await bcrypt.hash(plainTextPassword, 10);
  
    try {
      const response = await User.create({
        firstName,
        lastName,
        email,
        phone_number,
        password,
      });
      console.log('user created successfully: ', response);
  
      // Set HttpOnly cookie
      res.cookie('userId', response._id, { httpOnly: true, maxAge: 3600000 }); // maxAge is in milliseconds
  
      res.json({ status: 'ok' });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.json({ status: 'error', error: 'User Already Registered' });
      }
      res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
  });

// Check login status route (unchanged)
app.get('/api/check-login', (req, res) => {
  if (req.cookies.userId) {
    res.json({ status: 'ok' });
  } else {
    res.json({ status: 'error' });
  }
});

app.listen(9999, () => {
    console.log('server up at 9999');
});