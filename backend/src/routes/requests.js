const express = require('express');
const Request = require('../models/Request');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/requests  (anyone, optional auth)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { productId, type, name, email, phone, organizationName, message } = req.body;
    if (!productId || !type || !name || !email) {
      return res.status(400).json({ error: 'Product, type, name, and email are required.' });
    }
    const request = await Request.create({
      userId: req.user?._id || null,
      productId,
      type,
      name,
      email,
      phone: phone || '',
      organizationName: organizationName || '',
      message: message || ''
    });
    res.status(201).json({ message: 'Request submitted! We will contact you shortly.', request });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/requests/my  (customer's own requests)
router.get('/my', protect, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.user._id })
      .populate('productId', 'name category imageUrl')
      .sort({ createdAt: -1 });
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/requests  (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, type } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    const requests = await Request.find(filter)
      .populate('productId', 'name category')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ requests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/requests/:id/status  (admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes: adminNotes || '' },
      { new: true }
    );
    if (!request) return res.status(404).json({ error: 'Request not found.' });
    res.json({ message: 'Request updated.', request });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
