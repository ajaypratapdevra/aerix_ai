const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['education', 'safety', 'edtech_device', 'ai_assistant'],
    required: true
  },
  shortDesc: {
    type: String,
    required: true
  },
  fullDesc: {
    type: String,
    default: ''
  },
  priceRange: {
    type: String,
    // e.g. "₹15,000 – ₹25,000" or "Contact for pricing"
    default: 'Contact for pricing'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  badge: {
    type: String,
    // e.g. "EDUCATION", "SAFETY WEARABLE", "EDTECH DEVICE", "AI ASSISTANT"
    default: ''
  },
  ctaType: {
    type: String,
    enum: ['demo', 'quote', 'preorder'],
    default: 'demo'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
