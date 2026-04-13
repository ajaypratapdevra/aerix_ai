const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Workshop title is required'],
    trim: true
  },
  duration: {
    type: String,
    required: true,
    // e.g. "2 Days", "1 Day", "3 Days"
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  targetAudience: {
    type: String,
    required: true,
    // e.g. "Class 6–12", "All Ages"
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  imageUrl: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  workshopType: {
    type: String,
    enum: ['ai_tech', 'safety', 'chatbot', 'aerospace'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Workshop', workshopSchema);
