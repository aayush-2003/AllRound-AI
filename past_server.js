// const express = require('express')
// const path = require('path')
// const bodyParser = require('body-parser')
// const mongoose = require('mongoose')
// const User = require('./model/user')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const JWT_SECRET = 'dbyabyu3g4r2345brfsf49#^dferhyjhgf&%gjVfhdgfjGgjVDvdgdgda3rsrFHSGYVFUVBASDKIUFGYDrfwef' 

// mongoose.connect('mongodb://localhost:27017/ai', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })

// const app = express()
// app.use('/', express.static(path.join(__dirname, 'static')))
// app.use(bodyParser.json())

// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).lean();

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       // Invalid username or password
//       return res.status(401).json({ status: 'error', error: 'Invalid Username or Password' });
//     }

//     const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);
//     res.status(200).json({ status: 'ok', data: token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: 'error', error: 'Internal Server Error' });
//   }
// });

// app.post('/api/register', async (req, res) => {
//   console.log(req.body)

//   const { firstName, lastName, email, phone_number, password: plainTextPassword } = req.body

//   if (!firstName || typeof firstName !== 'string') {
//     return res.json({ status: 'error', error: 'Invalid Parameter' })
//   }
//   if (!lastName || typeof lastName !== 'string') {
//     return res.json({ status: 'error', error: 'Invalid Parameter' })
//   }
//   if (!plainTextPassword || plainTextPassword.length < 6) {
//     return res.json({
//       status: 'error',
//       error: 'Password should be greater than 6 Characters'
//     })
//   }

//   //hashing password
//   const password = await bcrypt.hash(plainTextPassword, 10)
//   console.log(password)
//   try {
//     const response = await User.create({
//       firstName,
//       lastName,
//       email,
//       phone_number,
//       password
//     })
//     console.log('user created successfully: ', response)
//   }
//   catch (error) {
//     console.log(error)
//     if (error.code == 11000) {
//       return res.json({ status: 'error', error: 'User Already Registered' })
//     }
//     throw error

//   }

//   res.json({ status: 'ok' })
// })
// // app.get('/ai', (req, res) => {
// //   app.use('/', express.static(path.join(__dirname, 'ai')))
// // });
// app.listen(9999, () => {
//   console.log('server up at 9999')
// })

// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const User = require('./model/user');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// require('dotenv').config(); // Load environment variables

// const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// mongoose.connect('mongodb://localhost:27017/ai', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const app = express();
// app.use('/', express.static(path.join(__dirname, 'static')));
// app.use(bodyParser.json());

// // Function to generate a JWT token
// function generateToken(user) {
//   return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
// }

// app.post('/api/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).lean();

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       // Invalid username or password
//       return res.status(401).json({ status: 'error', error: 'Invalid Username or Password' });
//     }

//     const token = generateToken(user);
//     res.status(200).json({ status: 'ok', data: token });
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

//     const token = generateToken(response);
//     res.cookie('token', token, { httpOnly: true, secure: true });
//     res.json({ status: 'ok' });
//   } catch (error) {
//     console.error(error);
//     if (error.code === 11000) {
//       return res.json({ status: 'error', error: 'User Already Registered' });
//     }
//     res.status(500).json({ status: 'error', error: 'Internal Server Error' });
//   }
// });

// app.listen(9999, () => {
//   console.log('server up at 9999');
// });
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

