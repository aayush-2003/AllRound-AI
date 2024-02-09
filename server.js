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
    if (req.session.isAuthenticated || req.url === '/api/login') {
        return next();
    } else {
        return res.redirect('/api/login'); // Adjust redirect path if needed
    }
};

// Serve static files with explicit Content-Type for script.js and style.css
app.use('/static', express.static(path.join(__dirname, 'static'), {
  setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
      } else if (path.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
      }
  },
}));

// Protect the entire 'ai' directory
app.use('/ai', requireAuth);

// Route for serving the protected index.html file
app.get('/ai/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'ai', 'index.html'));
});

// Serve static files from the 'static' directory
app.use('/', express.static(path.join(__dirname, 'static')));

// Logout route
app.get('/api/logout', (req, res) => {
    // Clear the userId cookie
    res.clearCookie('userId');
    // Set cache control headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    // Serve the login page directly
    res.redirect('/static/index.html');
});

app.get('/api/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'ai', 'index.html'));
});


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
        const maxAge = rememberMe ? 10 * 24 * 60 * 60 * 1000 : 1800000; // 10 days or 1/2 hour
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

app.listen(443, '192.168.29.76', () => {
    console.log('server up at 192.168.29.76:443');
});


// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const User = require('./model/user');
// const bcrypt = require('bcryptjs');
// const cookieParser = require('cookie-parser');
// require('dotenv').config(); // Load environment variables

// mongoose.connect('mongodb://localhost:27017/ai', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const app = express();
// app.use(bodyParser.json());
// app.use(cookieParser());

// // Middleware to check authentication status for /ai/index route
// const requireAuthForIndex = (req, res, next) => {
//   if (req.cookies.userId) {
//     // User is authenticated
//     return next();
//   } else {
//     // User is not authenticated, redirect to login page
//     return res.redirect('/api/login');
//   }
// };

// // Use the middleware for protecting the /ai/index route
// app.get('/ai/index', requireAuthForIndex, (req, res) => {
//   res.sendFile(__dirname + '/ai/index.html');
// });

// // Place express.static after your custom middleware
// app.use('/', express.static(path.join(__dirname, 'static')));

// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password, rememberMe } = req.body;
//     const user = await User.findOne({ email }).lean();

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       // Invalid username or password
//       return res.status(401).json({ status: 'error', error: 'Invalid Username or Password' });
//     }

//     // Set HttpOnly cookie
//     const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 60000; // 30 days or 1 hour
//     res.cookie('userId', user._id, { httpOnly: true, maxAge });

//     res.status(200).json({ status: 'ok' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 'error', error: 'Internal Server Error' });
//   }
// });

// app.post('/api/register', async (req, res) => {
//   const { firstName, lastName, email, phone_number, password: plainTextPassword } = req.body;

//   if (!firstName || typeof firstName !== 'string') {
//     return res.json({ status: 'error', error: 'Invalid Parameter' });
//   }
//   if (!lastName || typeof lastName !== 'string') {
//     return res.json({ status: 'error', error: 'Invalid Parameter' });
//   }
//   if (!plainTextPassword || plainTextPassword.length < 6) {
//     return res.json({ status: 'error', error: 'Password should be greater than 6 Characters' });
//   }

//   const password = await bcrypt.hash(plainTextPassword, 10);

//   try {
//     const response = await User.create({
//       firstName,
//       lastName,
//       email,
//       phone_number,
//       password,
//     });
//     console.log('user created successfully: ', response);

//     // Set HttpOnly cookie
//     res.cookie('userId', response._id, { httpOnly: true, maxAge: 3600000 }); // maxAge is in milliseconds

//     res.json({ status: 'ok' });
//   } catch (error) {
//     console.error(error);
//     if (error.code === 11000) {
//       return res.json({ status: 'error', error: 'User Already Registered' });
//     }
//     res.status(500).json({ status: 'error', error: 'Internal Server Error' });
//   }
// });

// app.get('/api/check-login', (req, res) => {
//   if (req.cookies.userId) {
//     res.json({ status: 'ok' });
//   } else {
//     res.json({ status: 'error' });
//   }
// });

// app.listen(9999, () => {
//   console.log('server up at 9999');
// });