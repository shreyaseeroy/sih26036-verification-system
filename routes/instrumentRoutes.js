const express = require('express');
const router = express.Router();
const Instrument = require('../models/Instrument');
const User = require('../models/User');

// GET /api/instruments - fetch all instruments
router.get('/', async (req, res) => {
  try {
    const instruments = await Instrument.find().populate('ownerId');
    res.json(instruments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/instruments/:id - fetch ONE instrument by its ID
router.get('/:id', async (req, res) => {
  try {
    const instrument = await Instrument.findById(req.params.id).populate('ownerId');
    if (!instrument) {
      return res.status(404).json({ error: "Instrument not found" });
    }
    res.json(instrument);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/instruments - create a new instrument
router.post('/', async (req, res) => {
  try {
    const newInstrument = await Instrument.create(req.body);
    res.status(201).json(newInstrument);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/instruments/:id - update an instrument
router.put('/:id', async (req, res) => {
  try {
    const updated = await Instrument.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Instrument not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;