const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Group = require('../models/group');  // Assuming you have a Group model
const Todo = require('../models/todo');    // Import your Todo model
const bcrypt = require('bcrypt');

// Existing routes...

// Create a new Todo
router.post('/todos', async (req, res) => {
  const { name, description, recurrence, groupId, userId } = req.body;

  // Validate required fields
  if (!name || !groupId) {
    return res.status(400).json({ message: 'Todo name and group ID are required.' });
  }

  try {
    // Validate that the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Validate that the group exists and belongs to the user
    const group = await Group.findById(groupId);
    if (!group || !user.groups.includes(groupId)) {
      return res.status(404).json({ message: 'Group not found or does not belong to user.' });
    }

    // Create a new Todo
    const newTodo = new Todo({
      name: name.trim(), // Ensure the name is trimmed
      description: description ? description.trim() : '', // Trim and default to empty if not provided
      recurrence: ['once', 'daily', 'weekly', 'monthly'].includes(recurrence) ? recurrence : 'once',
      userId: user._id, // Associate with the user
      groupId // Include the group ID
    });

    // Save the new Todo
    await newTodo.save();

    // Respond with success
    res.status(201).json({ message: 'Todo created successfully.', todo: newTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create todo.' });
  }
});

module.exports = router;
