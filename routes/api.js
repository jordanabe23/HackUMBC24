const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// Registration endpoint
router.post('/login', async (req, res) => {
  console.log('Register request received:', req.body); // Check if request reaches the server
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Username already exists.' });
    } else {
      res.status(500).json({ message: 'Error registering user.' });
    }
  }
});

module.exports = router;
