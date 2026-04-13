const express = require('express');
const Workshop = require('../models/Workshop');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/workshops  (public - all active workshops)
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ workshops });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/workshops/:id  (public)
router.get('/:id', async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ error: 'Workshop not found.' });
    res.json({ workshop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/workshops  (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json({ message: 'Workshop created.', workshop });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/workshops/:id  (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!workshop) return res.status(404).json({ error: 'Workshop not found.' });
    res.json({ message: 'Workshop updated.', workshop });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/workshops/:id  (admin only - soft delete)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Workshop.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Workshop deactivated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
