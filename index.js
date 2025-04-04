const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./User'); // Import the User model

const app = express();
const port = 3010;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));

// MongoDB Connection
mongoose.connect('mongodb+srv://aryamanpanwar187:kalvium@cluster0.dfxfka2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ MongoDB connected");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check for empty fields
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 App listening at http://localhost:${port}`);
});
