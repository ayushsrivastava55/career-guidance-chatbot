const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  risks: {
    type: [String],
    required: true
  },
  advantages: {
    type: [String],
    required: true
  },
  careerProspects: {
    type: [String],
    required: true
  },
  averageSalary: {
    type: Number,
    required: true
  },
  courseDuration: {
    type: Number,
    default: 4
  },
  eligibilityCriteria: {
    type: String
  }
});

module.exports = mongoose.model('Branch', branchSchema);
