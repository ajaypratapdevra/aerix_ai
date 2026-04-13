const express = require('express');
const Inquiry = require('../models/Inquiry');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/inquiries  (public contact form)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, inquiryType, message } = req.body;
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({ error: 'First name, last name, email, and message are required.' });
    }
    const inquiry = await Inquiry.create({
      userId: req.user?._id || null,
      firstName,
      lastName,
      email,
      phone: phone || '',
      inquiryType: inquiryType || 'General Inquiry',
      message
    });
    res.status(201).json({ message: 'Message sent! We will get back to you soon.', inquiry });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/inquiries  (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const inquiries = await Inquiry.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ inquiries });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/inquiries/:id/status  (admin)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ error: 'Inquiry not found.' });
    res.json({ message: 'Inquiry updated.', inquiry });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
