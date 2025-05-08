const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense','savings'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  mode: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank'],
    required: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  note: {
    type: String,
    trim: true,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
