const mongoose = require('mongoose');

const tagEnum = ["SA", "Harassment", "Sketchy"];

const PinSchema = new mongoose.Schema({
  longitude: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String,
    required: true
  },
  severity: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  tags: [{
    type: String,
    enum: tagEnum
  }],
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Pin', PinSchema);