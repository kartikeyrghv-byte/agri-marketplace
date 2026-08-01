const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['farmer', 'consumer', 'admin'],
    default: 'consumer'
  },
  isVerified: {
    type: Boolean,
    default: function() {
      return this.role !== 'farmer'; // farmers need approval, others auto-verified
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);