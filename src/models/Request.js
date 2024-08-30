const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  request_id: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Request || mongoose.model('Request', RequestSchema);
