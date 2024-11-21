const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true
  },
  ranking: {
    type: Number
  },
  established: {
    type: Number
  },
  website: {
    type: String
  }
});

module.exports = mongoose.model('College', collegeSchema);
