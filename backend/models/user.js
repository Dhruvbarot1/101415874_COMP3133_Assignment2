const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Avoid overwriting the model if it's already defined
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
