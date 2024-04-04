const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define schema and model
const promptOptionsSchema = new mongoose.Schema({
  prompt: String,
  promptOptions: [String]
});
const PromptOptions = mongoose.model('PromptOptions', promptOptionsSchema, 'promptOptions');
// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'dev_analysis'))); 

// Route to fetch data
app.get('/api/getData', async (req, res) => {
  try {
    const data = await PromptOptions.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// app.get('/', (req, res) => {
  
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
