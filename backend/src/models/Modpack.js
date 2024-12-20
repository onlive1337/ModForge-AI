const mongoose = require('mongoose');

const ModpackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['tech', 'magic', 'rpg', 'building', 'optimization', 'exploration'],
  },
  minecraftVersion: {
    type: String,
    required: true,
  },
  mods: [{
    modId: String,
    name: String,
    version: String,
    url: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Modpack', ModpackSchema);