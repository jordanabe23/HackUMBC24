const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Group = require('../models/group');
const Plant = require('../models/plant');

// Get all users
router.get('/users', async (req, res) => {
  const users = await User.find().populate('groups');
  res.json(users);
});

// Get all groups for a user
router.get('/users/:id/groups', async (req, res) => {
  const user = await User.findById(req.params.id).populate('groups');
  res.json(user.groups);
});

// Get plants in a group
router.get('/groups/:id/plants', async (req, res) => {
  const group = await Group.findById(req.params.id).populate('plants');
  res.json(group.plants);
});

// Add a plant to a group
router.post('/groups/:id/plants', async (req, res) => {
  const plant = new Plant(req.body);
  const group = await Group.findById(req.params.id);
  group.plants.push(plant);
  await plant.save();
  await group.save();
  res.json(plant);
});

module.exports = router;
