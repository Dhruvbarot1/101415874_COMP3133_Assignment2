const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false, // optional unless you're validating it
  },
  department: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: '',
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
