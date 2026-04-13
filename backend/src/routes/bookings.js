const express = require('express');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// POST /api/bookings  (authenticated customer)
router.post('/', protect, async (req, res) => {
  try {
    const { workshopId, schoolName, contactName, contactPhone, dateChosen, studentsCount, specialRequirements } = req.body;
    if (!workshopId || !schoolName || !contactName || !contactPhone || !dateChosen || !studentsCount) {
      return res.status(400).json({ error: 'All required fields must be provided.' });
    }
    const booking = await Booking.create({
      userId: req.user._id,
      workshopId,
      schoolName,
      contactName,
      contactPhone,
      dateChosen,
      studentsCount,
      specialRequirements: specialRequirements || ''
    });
    await booking.populate('workshopId', 'title duration price');
    res.status(201).json({ message: 'Booking submitted successfully!', booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/bookings/my  (customer's own bookings)
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('workshopId', 'title duration price imageUrl')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/bookings  (admin - all bookings)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const bookings = await Booking.find(filter)
      .populate('userId', 'name email phone')
      .populate('workshopId', 'title duration price')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Booking.countDocuments(filter);
    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/bookings/:id/status  (admin - update booking status)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes: adminNotes || '' },
      { new: true }
    ).populate('userId', 'name email').populate('workshopId', 'title');
    if (!booking) return res.status(404).json({ error: 'Booking not found.' });
    res.json({ message: 'Booking status updated.', booking });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
