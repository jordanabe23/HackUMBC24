const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Group = require('../models/group');  // Assuming you have a Group model
const bcrypt = require('bcrypt');

// Registration endpoint (renamed from '/login' to '/register')
router.post('/register', async (req, res) => {
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

// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Respond with the user ID and a success message (you could also add tokens here if needed)
    res.status(200).json({ message: 'Login successful.', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in.' });
  }
});

// Fetch user's groups by username
router.get('/user/:username/groups', async (req, res) => {
  const { username } = req.params;

  try {
    // Find the user by username and populate the 'groups' field
    const user = await User.findOne({ username }).populate('groups').exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return the user's groups
    res.status(200).json(user.groups);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching groups.' });
  }
});

// Create a new group
router.post('/groups', async (req, res) => {
  const { groupName, userId } = req.body;  // Assume userId is passed in the body

  if (!groupName) {
    return res.status(400).json({ message: 'Group name is required.' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Create a new group
    const newGroup = new Group({ groupName, todos: [] });
    await newGroup.save();

    // Add the group to the user's list of groups
    user.groups.push(newGroup);
    await user.save();

    // Respond with the new group
    res.status(201).json({ message: 'Group created successfully.', group: newGroup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create group.' });
  }
});

module.exports = router;
