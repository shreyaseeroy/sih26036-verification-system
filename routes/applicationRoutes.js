const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Instrument = require('../models/Instrument');
const User = require('../models/User');

// GET /api/applications - fetch all applications
router.get('/', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('instrumentId')
      .populate('applicantId')
      .populate('assignedTo');
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/:id - fetch ONE application
router.get('/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('instrumentId')
      .populate('applicantId')
      .populate('assignedTo');
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/applications - create a new application
router.post('/', async (req, res) => {
  try {
    const newApplication = await Application.create(req.body);
    res.status(201).json(newApplication);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/applications/:id - update an application (e.g. change status, assign LMO)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;