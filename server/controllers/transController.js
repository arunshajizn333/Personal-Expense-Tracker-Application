const Transaction = require('../models/transaction.model');
const csvParser = require('csv-parser');
const fs = require('fs');

// Add new transaction
const addTransaction = async (req, res) => {
  try {
    const { type, amount, mode, category, date, note } = req.body;
    const transaction = new Transaction({
      userId: req.user.userId,
      type,
      amount,
      mode,
      category,
      date,
      note,
    });
    const saved = await transaction.save();
    res.status(201).json({ message: 'Transaction added', transaction: saved });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get summary (income, expense, balance)
const getSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    const transactions = await Transaction.find({ userId });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalIncome - totalExpense;

    res.status(200).json({ totalIncome, totalExpense, balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Category-wise and monthly-wise analytics
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await Transaction.find({ userId });

    // Category-wise
    const categoryStats = {};
    transactions.forEach(t => {
      const cat = t.category;
      categoryStats[cat] = (categoryStats[cat] || 0) + t.amount;
    });

    // Monthly-wise
    const monthlyStats = {};
    transactions.forEach(t => {
      const month = `${t.date.getFullYear()}-${t.date.getMonth() + 1}`;
      if (!monthlyStats[month]) {
        monthlyStats[month] = { income: 0, expense: 0 };
      }
      monthlyStats[month][t.type] += t.amount;
    });

    res.status(200).json({ categoryStats, monthlyStats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const importCSV = async (req, res) => {
  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const transactions = [];

    // Parse the CSV data
    const fileBuffer = req.file.buffer;

    // Parse CSV using csv-parser
    require('streamifier').createReadStream(fileBuffer)
      .pipe(csvParser())
      .on('data', (row) => {
        const { type, amount, mode, category, date, note } = row;

        // Validate the data
        if (type && amount && mode && category && date) {
          transactions.push({
            userId: req.user.userId, // User ID from token
            type,
            amount: parseFloat(amount), // Ensure amount is a number
            mode,
            category,
            date: new Date(date),
            note: note || ''
          });
        }
      })
      .on('end', async () => {
        // Insert all valid transactions into the database
        if (transactions.length > 0) {
          await Transaction.insertMany(transactions);
          res.status(200).json({ message: 'Transactions imported successfully' });
        } else {
          res.status(400).json({ message: 'No valid transactions found in the CSV' });
        }
      })
      .on('error', (error) => {
        res.status(500).json({ message: 'Error parsing CSV file', error: error.message });
      });

  } catch (error) {
    res.status(500).json({ message: 'Error processing the CSV file', error: error.message });
  }
};


module.exports = {
  addTransaction,
  getSummary,
  getAnalytics,
  importCSV
};
