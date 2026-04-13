const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper: generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, schoolName, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const user = await User.create({
      name,
      email,
      passwordHash: password, // pre-save hook hashes it
      schoolName: schoolName || '',
      phone: phone || ''
    });
    const token = generateToken(user._id);
    res.status(201).json({
      message: 'Registration successful!',
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = generateToken(user._id);
    res.json({
      message: 'Login successful!',
      token,
      user: user.toJSON()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me  (get current logged-in user)
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// PUT /api/auth/profile  (update profile)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, schoolName, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, schoolName, phone },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Profile updated.', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
