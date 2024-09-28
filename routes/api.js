const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const Group = require('../models/group');
const Plant = require('../models/plant');

// Get all todos for a user's groups with plant details
router.get('/todos/user/:userId', async (req, res) => {
  try {
    const groups = await Group.find({ members: req.params.userId }).populate('todos plants');
    const todos = groups.flatMap(group => group.todos.map(todo => ({
      ...todo._doc,
      plant: group.plants.find(plant => String(plant._id) === String(todo.plantId))
    })));
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
