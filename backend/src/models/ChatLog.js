const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  sessionId: {
    type: String,
    required: true
    // Used to group messages in same conversation
  },
  message: {
    type: String,
    required: true
  },
  reply: {
    type: String,
    required: true
  },
  tokensUsed: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('ChatLog', chatLogSchema);
