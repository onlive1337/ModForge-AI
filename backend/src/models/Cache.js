const mongoose = require('mongoose');

const CacheSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }
  }
});

module.exports = mongoose.model('Cache', CacheSchema);