const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  lastActivity: {  
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('User', userSchema);
