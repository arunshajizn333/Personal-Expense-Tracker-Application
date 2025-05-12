// backend/controllers/transController.js
const Transaction = require('../models/transaction.model');
const csvParser = require('csv-parser');
const fs = require('fs');
const streamifier = require('streamifier'); // Import streamifier for parsing buffer

// Add new transaction
const addTransaction = async (req, res) => {
    try {
        const { type, amount, mode, category, date, note } = req.body;
        // Ensure userId is correctly added from the verified token
        const userId = req.user.userId; // Assuming verifyToken middleware adds user to req

        const transaction = new Transaction({
            userId: userId,
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
        console.error('Error adding transaction:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get summary (income, expense, balance)
const getSummary = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming verifyToken middleware adds user to req

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
        console.error('Error getting summary:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Category-wise and monthly-wise analytics
const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming verifyToken middleware adds user to req
        const transactions = await Transaction.find({ userId });

        // Category-wise
        const categoryStats = {};
        transactions.forEach(t => {
            // Ensure category exists and is a string before using as key
            const cat = t.category ? String(t.category) : 'Uncategorized';
            categoryStats[cat] = (categoryStats[cat] || 0) + t.amount;
        });

        // Monthly-wise
        const monthlyStats = {};
        transactions.forEach(t => {
            // Ensure date is a valid Date object
            if (t.date instanceof Date && !isNaN(t.date.getTime())) {
                 const month = `${t.date.getFullYear()}-${t.date.getMonth() + 1}`;
                 if (!monthlyStats[month]) {
                   monthlyStats[month] = { income: 0, expense: 0 };
                 }
                 monthlyStats[month][t.type] += t.amount;
            } else {
                console.warn('Skipping transaction with invalid date:', t);
            }
        });

        res.status(200).json({ categoryStats, monthlyStats });
    } catch (error) {
        console.error('Error getting analytics:', error);
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
        const userId = req.user.userId; // User ID from token

        // Parse CSV using csv-parser and streamifier
        streamifier.createReadStream(req.file.buffer)
            .pipe(csvParser())
            .on('data', (row) => {
                const { type, amount, mode, category, date, note } = row;

                // Basic validation for required fields
                if (type && amount && mode && category && date) {
                    // Ensure type is 'income' or 'expense'
                    const transactionType = type.toLowerCase();
                    if (transactionType !== 'income' && transactionType !== 'expense') {
                         console.warn(`Skipping row with invalid type: ${type}`, row);
                         return; // Skip this row
                    }

                    // Ensure amount is a valid number
                    const parsedAmount = parseFloat(amount);
                    if (isNaN(parsedAmount)) {
                        console.warn(`Skipping row with invalid amount: ${amount}`, row);
                        return; // Skip this row
                    }

                    // Ensure date is a valid date
                    const parsedDate = new Date(date);
                     if (isNaN(parsedDate.getTime())) {
                         console.warn(`Skipping row with invalid date: ${date}`, row);
                         return; // Skip this row
                     }


                    transactions.push({
                        userId: userId,
                        type: transactionType,
                        amount: parsedAmount,
                        mode: mode,
                        category: category,
                        date: parsedDate,
                        note: note || '' // Default note to empty string if missing
                    });
                } else {
                    console.warn('Skipping row with missing required fields:', row);
                }
            })
            .on('end', async () => {
                // Insert all valid transactions into the database
                if (transactions.length > 0) {
                    try {
                        await Transaction.insertMany(transactions);
                        res.status(200).json({ message: 'Transactions imported successfully', importedCount: transactions.length });
                    } catch (dbError) {
                         console.error('Database error during CSV import:', dbError);
                         res.status(500).json({ message: 'Error saving transactions to database', error: dbError.message });
                    }
                } else {
                    // If no valid transactions were found after parsing
                    res.status(400).json({ message: 'No valid transactions found in the CSV file' });
                }
            })
            .on('error', (error) => {
                console.error('Error parsing CSV file stream:', error);
                res.status(500).json({ message: 'Error parsing CSV file', error: error.message });
            });

    } catch (error) {
        console.error('Error processing the CSV file upload:', error);
        res.status(500).json({ message: 'Error processing the CSV file', error: error.message });
    }
};

// === NEW CONTROLLER FUNCTION TO DELETE A TRANSACTION ===
const deleteTransaction = async (req, res) => {
    try {
        const transactionId = req.params.id; // Get the ID from the URL parameters
        const userId = req.user.userId; // Get the user ID from the verified token

        // Find the transaction by ID AND ensure it belongs to the logged-in user
        const transaction = await Transaction.findOneAndDelete({
            _id: transactionId,
            userId: userId
        });

        // Check if the transaction was found and deleted
        if (!transaction) {
            // If not found, it might be because the ID is wrong or it doesn't belong to the user
            return res.status(404).json({ message: 'Transaction not found or you do not have permission to delete it' });
        }

        // If found and deleted successfully
        res.status(200).json({ message: 'Transaction deleted successfully', deletedTransactionId: transactionId });

    } catch (error) {
        console.error('Error deleting transaction:', error);
        // Handle potential errors (e.g., invalid ID format)
        res.status(500).json({ message: 'Server error deleting transaction', error: error.message });
    }
};
// =======================================================


module.exports = {
    addTransaction,
    getSummary,
    getAnalytics,
    importCSV,
    deleteTransaction // === EXPORT THE NEW FUNCTION ===
};
