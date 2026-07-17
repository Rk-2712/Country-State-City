const express = require('express');
const router = express.Router();
const City = require('../models/City');

// GET all cities
router.get('/', async (req, res) => {
  try {
    const cities = await City.findAll();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET cities by state ID
router.get('/state/:stateId', async (req, res) => {
  try {
    const cities = await City.findByStateId(req.params.stateId);
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new city
router.post('/', async (req, res) => {
  const { name, state } = req.body;
  try {
    const newCity = await City.create({ name, state });
    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a city
router.delete('/:id', async (req, res) => {
  try {
    const success = await City.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'City not found' });
    }
    res.json({ message: 'City deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
