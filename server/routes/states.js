const express = require('express');
const router = express.Router();
const State = require('../models/State');

// GET all states
router.get('/', async (req, res) => {
  try {
    const states = await State.findAll();
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET states by country ID
router.get('/country/:countryId', async (req, res) => {
  try {
    const states = await State.findByCountryId(req.params.countryId);
    res.json(states);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new state
router.post('/', async (req, res) => {
  const { name, country, capital } = req.body;
  try {
    const newState = await State.create({ name, country, capital });
    res.status(201).json(newState);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update an existing state
router.put('/:id', async (req, res) => {
  const { name, country, capital } = req.body;
  try {
    const updatedState = await State.update(req.params.id, { name, country, capital });
    if (!updatedState) {
      return res.status(404).json({ message: 'State not found' });
    }
    res.json(updatedState);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a state
router.delete('/:id', async (req, res) => {
  try {
    const success = await State.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'State not found' });
    }
    res.json({ message: 'State deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
