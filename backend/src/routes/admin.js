const express = require('express');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Request = require('../models/Request');
const Inquiry = require('../models/Inquiry');
const ChatLog = require('../models/ChatLog');
const Workshop = require('../models/Workshop');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// GET /api/admin/stats  (dashboard overview)
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalBookings,
      pendingBookings,
      totalRequests,
      newInquiries,
      totalWorkshops,
      recentBookings,
      recentInquiries
    ] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Request.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Workshop.countDocuments({ isActive: true }),
      Booking.find().populate('userId', 'name').populate('workshopId', 'title').sort({ createdAt: -1 }).limit(5),
      Inquiry.find({ status: 'new' }).sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({
      stats: {
        totalUsers,
        totalBookings,
        pendingBookings,
        totalRequests,
        newInquiries,
        totalWorkshops
      },
      recentBookings,
      recentInquiries
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users  (list all users)
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id/toggle  (activate/deactivate user)
router.put('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id/role  (change user role)
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role.' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User role updated.', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
